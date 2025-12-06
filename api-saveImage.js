const fs = require('fs');
const path = require('path');

// Ensure output directory exists
const OUTPUT_DIR = path.join(__dirname, '_iteration_output');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

module.exports = (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    try {
        // Remove header (e.g., "data:image/png;base64,")
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        const timestamp = Date.now();
        const filename = `iteration_${timestamp}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);

        fs.writeFile(filepath, buffer, (err) => {
            if (err) {
                console.error('Error saving file:', err);
                return res.status(500).json({ success: false, message: 'Failed to save image' });
            }
            
            console.log(`Image saved: ${filename}`);
            res.json({ success: true, filename: filename, path: filepath });
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ success: false, message: 'Server error processing image' });
    }
};

