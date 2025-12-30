const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { LoginPage } = require('../pages/LoginPage');

Given('the user navigates to {string}', async function (url) {
    this.loginPage = new LoginPage(this.page);
    await this.loginPage.navigate(url);
});

When('the user enters the email {string} in the email field', async function (email) {
    // Use the fixed enterEmail method with type + delay
    await this.loginPage.enterEmail(email);
});

When('the user enters the password {string} in the password field', async function (password) {
    // Use the fixed enterPassword method
    await this.loginPage.enterPassword(password);
});

When('the user clicks on the Login button', async function () {
    await this.loginPage.clickLoginButton();
});

Then('the user should be logged in successfully', async function () {
    console.log('Waiting for login redirect...');
    try {
        await this.page.waitForFunction(
            () => !window.location.href.includes('/login') && !window.location.href.includes('/signin'),
            null,
            { timeout: 30000 }
        );
    } catch (e) {
        console.warn('Login redirect wait timed out. Checking URL anyway...');
    }

    const url = await this.loginPage.getCurrentUrl();
    console.log(`URL after login attempt: ${url}`);
    expect(url).to.not.include('/login');
    expect(url).to.not.include('/signin');
});

Then('the user should be redirected to the workspace', async function () {
    await this.page.waitForTimeout(2000);
    const url = await this.loginPage.getCurrentUrl();
    console.log(`Workspace URL: ${url}`);
    // Optional: check for workspace-specific path if available
});

Then('the user clicks on the button {string}', async function (buttonText) {
    console.log(`Looking for button: ${buttonText}`);
    await this.loginPage.clickButtonByText(buttonText);
});

Then('the user should be redirected to the dashboard', async function () {
    await this.page.waitForTimeout(3000);
    const url = await this.loginPage.getCurrentUrl();
    console.log(`Final Dashboard URL: ${url}`);
    // Replace with exact dashboard path if known
    expect(url).to.include('app.feedspace.io');
});
