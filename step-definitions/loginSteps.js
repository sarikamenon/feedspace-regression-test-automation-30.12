const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { LoginPage } = require('../pages/LoginPage');
const { MailinatorPage } = require('../pages/MailinatorPage');

Given('I navigate to the Feedspace sign-in page', async function () {
    this.loginPage = new LoginPage(this.page);
    await this.loginPage.navigate();
});

When('I enter the email {string}', async function (email) {
    await this.loginPage.enterEmail(email);
});

When('I click on "Send Sign-In Code" button', async function () {
    await this.loginPage.clickSendCode();
    await this.page.waitForTimeout(2000);
});

When('I fetch the OTP from Mailinator for user {string}', async function (username) {
    const mailinator = new MailinatorPage(this.context); // Access context from World
    this.fetchedOtp = await mailinator.getOtp(username);
});

When('I enter the retrieved OTP', async function () {
    if (!this.fetchedOtp) throw new Error("OTP was not fetched in previous step");
    await this.loginPage.enterOtp(this.fetchedOtp);
    // Added a small wait to allow the auto-login redirect to start
    await this.page.waitForTimeout(2000);
});

Then('I should be logged in successfully', async function () {
    // Wait for the URL to change away from /signin
    await this.page.waitForTimeout(3000);
    const url = await this.loginPage.getCurrentUrl();
    console.log(`URL after login attempt: ${url}`);

    expect(url).to.not.include('/signin');
});

Then('I should be redirected to the workspace', async function () {
    await this.page.waitForTimeout(2000);
    const url = await this.loginPage.getCurrentUrl();
    expect(url).to.include('app.feedspace.io');
});

Then('I should click on the button {string}', async function (buttonText) {
    console.log(`Looking for button: ${buttonText}`);
    await this.loginPage.clickButtonByText(buttonText);
});

Then('I should be redirected to the dashboard', async function () {
    await this.page.waitForTimeout(3000);
    const url = await this.loginPage.getCurrentUrl();
    console.log(`Final Dashboard URL: ${url}`);
    expect(url).to.include('app.feedspace.io');
});
