const puppeteer = require("puppeteer")

let browser,page;

beforeAll(async () => {
    browser = await puppeteer.launch({
        // headless : false
    });
    page = await browser.newPage();
})

afterAll(async () => {
    await browser.close();
})

describe('Tests Browser', () => {
    test('Opens Page', async () => {
        await page.goto("https://www.browsersync.io")
        const _text = await page.$eval("h1",el => el.textContent);
        let text = _text;

        expect(text.length).toBeGreaterThan(0)
        console.log(text)

    },10000)
})


