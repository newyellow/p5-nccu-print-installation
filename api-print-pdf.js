const printer = require('pdf-to-printer');
const path = require('path');
const fs = require('fs');

async function printImage(pathToImage) {

    // console log all printers name
    const printers = await printer.getPrinters();
    console.log('Available printers:');
    printers.forEach(p => console.log(`- ${p.name}`));

    // pdf-to-printer's print function
    await printer.print(pathToImage, {
        printer: 'EPSON L3550 Series',
        paperSize: 'Postcard',
        scale: 'noscale'
    });
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
        await printImage(filepath);
        res.json({ success: true, message: 'Sent to printer (pdf-to-printer)' });
    } catch (error) {
        console.error('Error printing with pdf-to-printer:', error);
        res.status(500).json({ success: false, message: 'Printing failed: ' + error.message });
    }
};
