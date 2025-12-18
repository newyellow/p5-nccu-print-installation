const ipp = require('ipp');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const PRINTER_URL = 'http://192.168.0.50:631/ipp/print';

// Ensure temp directory exists
const TEMP_DIR = path.join(__dirname, '_temp_pdf');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

function generatePDF(imagePath, pdfPath, direction = 'landscape') {
    return new Promise((resolve, reject) => {
        try {
            // Create a document with postcard size
            // 1mm = 2.83465 points
            // 100mm = 283.465 points
            // 148mm = 419.528 points
            
            let pdfW = 419.528; // Landscape by default in this context? 
            let pdfH = 283.465;

            if (direction === 'portrait') {
                pdfW = 283.465;
                pdfH = 419.528;
            }

            const doc = new PDFDocument({
                size: [pdfW, pdfH],
                margin: 0
            });

            const stream = fs.createWriteStream(pdfPath);
            doc.pipe(stream);

            // Add image to fit the page completely
            doc.image(imagePath, 0, 0, {
                width: pdfW,
                height: pdfH,
                fit: [pdfW, pdfH]
            });

            doc.end();

            stream.on('finish', () => {
                resolve(pdfPath);
            });

            stream.on('error', (err) => {
                reject(err);
            });

        } catch (err) {
            reject(err);
        }
    });
}

function printPdfIpp(pdfPath, direction = 'landscape') {
    return new Promise((resolve, reject) => {
        const pdfData = fs.readFileSync(pdfPath);
        const printer = ipp.Printer(PRINTER_URL);

        const msg = {
            'operation-attributes-tag': {
                'requesting-user-name': 'kiosk',
                'job-name': 'Photo print',
                'document-format': 'application/pdf'
            },
            'job-attributes-tag': {
                'media': 'postcard',
                'print-scaling': 'fill',
                'orientation-requested': direction === 'portrait' ? 3 : 4
            },
            data: pdfData
        };

        printer.execute('Print-Job', msg, (err, res) => {
            if (err) {
                console.error('IPP error:', err);
                reject(err);
            } else {
                console.log('IPP response:', res);
                if (res.statusCode === 'successful-ok' || res.statusCode === 'successful-ok-ignored-or-substituted-attributes') {
                    resolve(res);
                } else {
                    reject(new Error(`IPP Status: ${res.statusCode}`));
                }
            }
        });
    });
}

module.exports = async (req, res) => {
    const { filename, direction } = req.body;

    if (!filename) {
        return res.status(400).json({ success: false, message: 'No filename provided' });
    }

    const imagePath = path.join(__dirname, '_iteration_output', filename);
    console.log(`[ipp printer] Received print request for file: ${filename}, direction: ${direction}`);
    console.log(`[ipp printer] Image path: ${imagePath}`);

    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ success: false, message: 'Image file not found' });
    }

    const pdfFilename = `temp_${Date.now()}.pdf`;
    const pdfPath = path.join(TEMP_DIR, pdfFilename);

    try {
        console.log(`[ipp printer] Generating PDF: ${pdfPath} (${direction})`);
        await generatePDF(imagePath, pdfPath, direction);
        
        console.log(`[ipp printer] Sending PDF to printer...`);
        await printPdfIpp(pdfPath, direction);
        
        res.json({ success: true, message: 'Sent to printer (IPP/PDF)' });
    } catch (error) {
        console.error('Error printing with IPP:', error);
        res.status(500).json({ success: false, message: 'Printing failed: ' + error.message + '. Check server console for IP config.' });
    }
};
