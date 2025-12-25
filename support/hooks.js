const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

setDefaultTimeout(180 * 1000);

let browser;
let context;
let page;

BeforeAll(async function () {
    browser = await chromium.launch({ headless: false }); // Set to true for headless
});

AfterAll(async function () {
    await browser.close();
});

Before(async function () {
    context = await browser.newContext();
    page = await context.newPage();
    this.page = page; // Attach page to the world instance
    this.context = context; // Attach context to the world instance
});

After(async function () {
    await page.close();
    await context.close();
});
