const printer = require('pdf-to-printer');
const path = require('path');
const fs = require('fs');

async function printImage(pathToImage, direction = 'landscape', dpi = 300) {
    // console log all printers name
    const printers = await printer.getPrinters();
    console.log('Available printers:');
    printers.forEach(p => console.log(`- ${p.name}`));

    console.log(`[pdf printer] Printing image directly: ${pathToImage} at ${dpi} DPI, direction: ${direction}`);
    
    // Using explicit unix flags to ensure orientation and scaling are handled by the system driver
    const options = {
        printer: 'EPSON L3550 Series',
        // We use unix flags for better control on macOS
        unix: [
            `-o resolution=${dpi}dpi`,
            '-o media=A6',
            '-o fit-to-page',
            '-o image-position=center',
            // orientation-requested: 3=portrait, 4=landscape
            direction === 'portrait' ? '-o orientation-requested=3' : '-o orientation-requested=4',
            '-o no-auto-rotate' // Prevent driver from rotating image based on its own guess
        ]
    };

    await printer.print(pathToImage, options);
}

module.exports = async (req, res) => {
    const { filename, direction, dpi = 300 } = req.body;

    if (!filename) {
        return res.status(400).json({ success: false, message: 'No filename provided' });
    }

    console.log(`[pdf printer] Received print request for file: ${filename}, direction: ${direction}, dpi: ${dpi}`);

    const filepath = path.join(__dirname, '_iteration_output', filename);

    console.log(`[pdf printer] Full file path: ${filepath}`);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }

    try {
        await printImage(filepath, direction, dpi);
        res.json({ success: true, message: `Sent to printer (direct image printing, A6 fit, ${dpi} DPI)` });
    } catch (error) {
        console.error('Error printing with pdf-to-printer:', error);
        res.status(500).json({ success: false, message: 'Printing failed: ' + error.message });
    }
};
