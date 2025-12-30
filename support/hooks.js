const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

setDefaultTimeout(180 * 1000);

let browser;
let context;
let page;

BeforeAll(async function () {
    browser = await chromium.launch({ headless: process.env.CI ? true : false }); // Set to true for headless in CI
});

AfterAll(async function () {
    await browser.close();
});

Before(async function () {
    const viewport = process.env.CI ? { width: 1920, height: 1080 } : { width: 1280, height: 720 };
    context = await browser.newContext({ viewport });
    page = await context.newPage();
    this.page = page; // Attach page to the world instance
    this.context = context; // Attach context to the world instance
});

After(async function (scenario) {
    if (scenario.result.status === 'FAILED') {
        const screenshot = await this.page.screenshot({ path: `reports/screenshots/${scenario.pickle.name.replace(/ /g, '_')}_failure.png`, fullPage: true });
        this.attach(screenshot, 'image/png');
        console.log(`Screenshot saved for failed scenario: ${scenario.pickle.name}`);
    }
    await this.page.close();
    await this.context.close();
});
