const ipp = require('ipp')
const path = require('path')
const fs = require('fs')

const PRINTER_URL = 'http://192.168.0.50:631/ipp/print'

function printImageIpp(path) {
  const imageData = fs.readFileSync(path)     // Buffer

  const printer = ipp.Printer(PRINTER_URL)

  const msg = {
    'operation-attributes-tag': {
      'requesting-user-name': 'kiosk',       // any string
      'job-name': 'Photo print',             // shows in printer UI
      'document-format': 'image/png'        // MIME type of data
    },
    data: imageData                           // raw PNG bytes
  }

  printer.execute('Print-Job', msg, (err, res) => {
    if (err) {
      console.error('IPP error:', err)
      return
    }
    console.log('IPP response:', res)
  })
}

module.exports = async (req, res) => {
    const { filename } = req.body;

    if (!filename) {
        return res.status(400).json({ success: false, message: 'No filename provided' });
    }

    const filepath = path.join(__dirname, '_iteration_output', filename);

    console.log(`[ipp printer] Received print request for file: ${filename}`);
    console.log(`[ipp printer] printing file path: ${filepath}`);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }

    try {
        // NOTE: This will fail if the PRINTER_URL is not correct.
        // The user needs to set the correct IP.
        await printImageIpp(filepath);
        res.json({ success: true, message: 'Sent to printer (IPP)' });
    } catch (error) {
        console.error('Error printing with IPP:', error);
        res.status(500).json({ success: false, message: 'Printing failed: ' + error.message + '. Check server console for IP config.' });
    }
};
