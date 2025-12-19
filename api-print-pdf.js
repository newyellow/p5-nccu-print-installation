const printer = require('pdf-to-printer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Ensure temp directory exists
const TEMP_DIR = path.join(__dirname, '_temp_pdf');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

function generatePDF(imagePath, pdfPath, direction = 'landscape') {
    return new Promise((resolve, reject) => {
        try {
            // Postcard size: 100mm x 148mm
            // 1mm = 2.83465 points
            const mmToPt = 2.83465;
            let width = 148 * mmToPt;
            let height = 100 * mmToPt;

            if (direction === 'portrait') {
                [width, height] = [height, width];
            }

            const doc = new PDFDocument({
                size: [width, height],
                margin: 0
            });

            const stream = fs.createWriteStream(pdfPath);
            doc.pipe(stream);

            // "cover" mode: fills the entire page, cropping if necessary
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

async function printImage(pathToImage, direction = 'landscape') {
    // console log all printers name
    const printers = await printer.getPrinters();
    console.log('Available printers:');
    printers.forEach(p => console.log(`- ${p.name}`));

    const pdfFilename = `temp_print_${Date.now()}.pdf`;
    const pdfPath = path.join(TEMP_DIR, pdfFilename);

    try {
        console.log(`[pdf printer] Generating temporary PDF: ${pdfPath}`);
        await generatePDF(pathToImage, pdfPath, direction);

        console.log(`[pdf printer] Printing PDF: ${pdfPath}`);
        // pdf-to-printer's print function
        await printer.print(pdfPath, {
            printer: 'EPSON L3550 Series',
            paperSize: 'Postcard',
            scale: 'noscale' // PDF is already the right size
        });

        // Clean up temp file
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
            console.log(`[pdf printer] Deleted temporary PDF: ${pdfPath}`);
        }
    } catch (error) {
        // Try to clean up even if printing fails
        if (fs.existsSync(pdfPath)) {
            try { fs.unlinkSync(pdfPath); } catch (e) {}
        }
        throw error;
    }
}

module.exports = async (req, res) => {
    const { filename, direction } = req.body;

    if (!filename) {
        return res.status(400).json({ success: false, message: 'No filename provided' });
    }

    console.log(`[pdf printer] Received print request for file: ${filename}, direction: ${direction}`);

    const filepath = path.join(__dirname, '_iteration_output', filename);

    console.log(`[pdf printer] Full file path: ${filepath}`);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }

    try {
        await printImage(filepath, direction);
        res.json({ success: true, message: 'Sent to printer (pdf-to-printer with PDF conversion)' });
    } catch (error) {
        console.error('Error printing with pdf-to-printer:', error);
        res.status(500).json({ success: false, message: 'Printing failed: ' + error.message });
    }
};
