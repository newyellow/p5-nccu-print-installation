const printer = require('pdf-to-printer');
const path = require('path');
const fs = require('fs');

async function printImage(pathToImage, direction = 'landscape') {
    // console log all printers name
    const printers = await printer.getPrinters();
    console.log('Available printers:');
    printers.forEach(p => console.log(`- ${p.name}`));

    console.log(`[pdf printer] Printing image directly: ${pathToImage}`);
    
    // Using settings that worked for the user in the browser: A6 and actual size
    const options = {
        printer: 'EPSON L3550 Series',
        paperSize: 'A6',
        scale: 'noscale'
    };

    if (direction === 'portrait') {
        options.orientation = 'portrait';
    } else {
        options.orientation = 'landscape';
    }

    await printer.print(pathToImage, options);
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
        res.json({ success: true, message: 'Sent to printer (direct image printing with A6/noscale)' });
    } catch (error) {
        console.error('Error printing with pdf-to-printer:', error);
        res.status(500).json({ success: false, message: 'Printing failed: ' + error.message });
    }
};
