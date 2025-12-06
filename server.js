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
const apiSaveImage = require('./api-saveImage');
app.post('/api/save-image', apiSaveImage);

// API Endpoint: Print with pdf-to-printer
const apiPrintPdf = require('./api-print-pdf');
app.post('/api/print-pdf', apiPrintPdf);

// API Endpoint: Print with node-printer
const apiPrintIpp = require('./api-print-ipp');
app.post('/api/print-ipp', apiPrintIpp);

const apiPrintIppPdf = require('./api-print-ipp-pdf');
app.post('/api/print-ipp-pdf', apiPrintIppPdf);

// Start server
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    
    // Open the system UI automatically
    // Pointing to the print_system_ui/index.html
    const uiUrl = `http://localhost:${PORT}/print_system_ui/index.html`;
    console.log(`Opening UI at ${uiUrl}`);
    await open(uiUrl);
});