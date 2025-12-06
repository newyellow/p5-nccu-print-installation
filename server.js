const express = require('express');
const fs = require('fs');
const path = require('path');
const open = require('open');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for large images
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Ensure output directory exists
const OUTPUT_DIR = path.join(__dirname, '_iteration_output');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// API Endpoint to save image
app.post('/api/save-image', (req, res) => {
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
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    
    // Open the system UI automatically
    // Pointing to the print_system_ui/index.html
    const uiUrl = `http://localhost:${PORT}/print_system_ui/index.html`;
    console.log(`Opening UI at ${uiUrl}`);
    await open(uiUrl);
});

