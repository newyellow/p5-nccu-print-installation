const printer = require('pdf-to-printer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Ensure temp directory exists
const TEMP_DIR = path.join(__dirname, '_temp_pdf');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

/**
 * Generates a PDF from an image with exact A6 dimensions and "cover" scaling.
 */
function generateA6PDF(imagePath, pdfPath, direction = 'landscape') {
    return new Promise((resolve, reject) => {
        try {
            // A6 size: 105mm x 148mm
            // 1mm = 2.83465 points
            const mmToPt = 2.83465;
            let width = 105 * mmToPt;
            let height = 148 * mmToPt;

            // Swap for landscape
            if (direction === 'landscape') {
                [width, height] = [height, width];
            }

            const doc = new PDFDocument({
                size: [width, height],
                margin: 0
            });

            const stream = fs.createWriteStream(pdfPath);
            doc.pipe(stream);

            // "cover" mode: fills the entire page, cropping if necessary to avoid any white edges
            doc.image(imagePath, 0, 0, {
                cover: [width, height],
                align: 'center',
                valign: 'center'
            });

            doc.end();

            stream.on('finish', () => resolve(pdfPath));
            stream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
}

async function printImage(pathToImage, direction = 'landscape', dpi = 300) {
    // Log available printers for debugging
    const printers = await printer.getPrinters();
    console.log('Available printers:');
    printers.forEach(p => console.log(`- ${p.name}`));

    const pdfFilename = `temp_print_${Date.now()}.pdf`;
    const pdfPath = path.join(TEMP_DIR, pdfFilename);

    try {
        console.log(`[pdf printer] Converting to A6 PDF: ${pdfPath}, direction: ${direction}`);
        await generateA6PDF(pathToImage, pdfPath, direction);

        console.log(`[pdf printer] Printing PDF: ${pdfPath} at ${dpi} DPI`);
        
        const options = {
            printer: 'EPSON L3550 Series',
            // Using unix flags for maximum control over the Epson driver
            unix: [
                `-o resolution=${dpi}dpi`,
                '-o media=A6', // Some drivers use 'A6', some 'Postcard'
                '-o fit-to-page',
                '-o image-position=center',
                // We match orientation-requested to the PDF page orientation
                // 3=portrait, 4=landscape
                direction === 'portrait' ? '-o orientation-requested=3' : '-o orientation-requested=4',
                '-o no-auto-rotate'
            ]
        };

        await printer.print(pdfPath, options);

        // Success - clean up
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
            console.log(`[pdf printer] Deleted temporary PDF: ${pdfPath}`);
        }
    } catch (error) {
        // Cleanup on failure
        if (fs.existsSync(pdfPath)) {
            try { fs.unlinkSync(pdfPath); } catch (e) {}
        }
        throw error;
    }
}

module.exports = async (req, res) => {
    const { filename, direction, dpi = 300 } = req.body;

    if (!filename) {
        return res.status(400).json({ success: false, message: 'No filename provided' });
    }

    console.log(`[pdf printer] Received print request for file: ${filename}, direction: ${direction}, dpi: ${dpi}`);

    const filepath = path.join(__dirname, '_iteration_output', filename);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }

    try {
        await printImage(filepath, direction, dpi);
        res.json({ success: true, message: `Sent to printer (A6 PDF conversion, 100% fill, ${dpi} DPI)` });
    } catch (error) {
        console.error('Error printing with pdf-to-printer:', error);
        res.status(500).json({ success: false, message: 'Printing failed: ' + error.message });
    }
};
