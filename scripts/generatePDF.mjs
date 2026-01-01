import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generatePDF = async () => {
    console.log('🚀 Launching browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    const page = await browser.newPage();

    // Set viewport to letter size (wider for debugging)
    await page.setViewport({ width: 1200, height: 1600 });

    console.log('📄 Navigating to Signal Brief...');
    await page.goto('http://localhost:5175/brief', {
        waitUntil: 'networkidle2',
        timeout: 60000
    });

    // Wait for main content to render (look for the h1 title)
    console.log('⏳ Waiting for content to render...');
    await page.waitForSelector('h1', { timeout: 15000 });

    // Extra wait to ensure all styles are applied
    await new Promise(r => setTimeout(r, 3000));

    // Debug: Take a screenshot to see what we're capturing
    const debugScreenshotPath = path.join(__dirname, '..', 'debug_capture.png');
    await page.screenshot({ path: debugScreenshotPath, fullPage: true });
    console.log(`📸 Debug screenshot saved to: ${debugScreenshotPath}`);

    console.log('📝 Generating PDF...');
    const outputPath = path.join(__dirname, '..', 'Executive_GTM_Signal_Brief.pdf');

    await page.pdf({
        path: outputPath,
        format: 'Letter',
        printBackground: true,
        preferCSSPageSize: false,
        scale: 0.85,
        margin: {
            top: '0.3in',
            right: '0.3in',
            bottom: '0.3in',
            left: '0.3in'
        }
    });

    console.log(`✅ PDF saved to: ${outputPath}`);

    await browser.close();
    console.log('🎉 Done!');
};

generatePDF().catch(err => {
    console.error('❌ Error generating PDF:', err);
    process.exit(1);
});
