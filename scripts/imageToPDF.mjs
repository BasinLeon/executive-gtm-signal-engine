import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagePath = path.join(__dirname, '..', 'debug_capture.png');
const outputPath = path.join(__dirname, '..', 'Executive_GTM_Signal_Brief.pdf');

console.log('📄 Converting screenshot to PDF...');

// Letter size: 612 x 792 points
const doc = new PDFDocument({
    size: 'letter',
    margin: 0
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Add the image, scaled to fit the page
doc.image(imagePath, 0, 0, {
    width: 612,
    height: 792,
    fit: [612, 792],
    align: 'center',
    valign: 'top'
});

doc.end();

writeStream.on('finish', () => {
    const stats = fs.statSync(outputPath);
    console.log(`✅ PDF saved to: ${outputPath}`);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(1)} KB`);
});
