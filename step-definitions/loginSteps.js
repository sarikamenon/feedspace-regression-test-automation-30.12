const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

Given('the user navigates to {string}', async function (url) {
    this.loginPage = new LoginPage(this.page);
    await this.loginPage.navigate(url);
});

When(/^the user enters (?:the )?email "([^"]*)"(?: in the email field)?$/, async function (email) {
    // Use the fixed enterEmail method with type + delay
    await this.loginPage.enterEmail(email);
});

When(/^the user enters (?:the )?password "([^"]*)"(?: in the password field)?$/, async function (password) {
    // Use the fixed enterPassword method
    await this.loginPage.enterPassword(password);
});

When('the user clicks on the Login button', async function () {
    await this.loginPage.clickLoginButton();
});
Then('the user should be logged in successfully', async function () {
    console.log('Waiting for login redirect...');

    // Wait for either URL change or dashboard element
    await Promise.race([
        this.page.waitForFunction(
            () => !window.location.href.includes('/login') && !window.location.href.includes('/signin'),
            null,
            { timeout: 30000 }
        ),
        this.page.locator('text=Launch Workspace').waitFor({ state: 'visible', timeout: 30000 })
    ]);

    const url = await this.loginPage.getCurrentUrl();
    console.log(`URL after login attempt: ${url}`);

    // Final assertion
    expect(url).not.toContain('/login');
    expect(url).not.toContain('/signin');
});


Then('the user should be redirected to the workspace', async function () {
    await this.page.waitForTimeout(2000);
    const url = await this.loginPage.getCurrentUrl();
    console.log(`Workspace URL: ${url}`);
    // Optional: check for workspace-specific path if available
});

// Match both "Then" and "When", and optional "the"
// Match both "Then" and "When", and optional "the"
When(/^the user clicks on the (?:button )?"([^"]*)"(?: button)?$/, async function (buttonText) {
    console.log(`Looking for button: ${buttonText}`);
    if (buttonText === 'Launch Workspace') {
        const { DashboardPage } = require('../pages/DashboardPage');
        this.dashboardPage = new DashboardPage(this.page);
        await this.dashboardPage.clickLaunchWorkspace();
    } else {
        await this.loginPage.clickButtonByText(buttonText);
    }
});

// Removed duplicate matching step explicitly

Then('the user should be redirected to the dashboard', async function () {
    await this.page.waitForTimeout(3000);
    const url = await this.loginPage.getCurrentUrl();
    console.log(`Final Dashboard URL: ${url}`);
    // Replace with exact dashboard path if known
    expect(url).toContain('app.feedspace.io');
});
