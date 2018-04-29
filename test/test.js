const path = require('path');
const puppeteer = require('puppeteer');

const extensionPath = path.resolve(__dirname, '../example/');

jest.setTimeout(30000);

test('Emits action over port', async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--disable-extensions-except=' + extensionPath,
            '--load-extension=' + extensionPath,
        ],
        slowMo: 200
    });

    const page1 = await browser.newPage();
    await page1.goto('http://localhost:8080');

    const page2 = await browser.newPage();
    await page2.goto('http://localhost:8080');

    await page1.bringToFront();
    await page1.type('input[type=text]', 'Headless Chrome');
    await page1.click('input[type=button]');

    await page2.bringToFront();

    const text = await page2.evaluate(() => document.querySelector('li').textContent);

    expect(text).toBe('Headless Chrome');

    browser.close();
});

