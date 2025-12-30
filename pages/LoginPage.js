class LoginPage {
    constructor(page) {
        this.page = page;
        this.url = 'https://app.feedspace.io/signin';

        // --- Locators (User Provided) ---
        this.emailInput = '#email';
        this.passwordInput = '#password';
        this.loginBtn = '#loginButton';

        // Dynamic locator for any button with specific text
        this.genericBtn = (text) => `button:has-text("${text}")`;
    }

    async navigate(url) {
        const targetUrl = url || this.url;
        console.log(`Navigating to ${targetUrl}`);
        await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    }

    async enterEmail(email) {
        console.log(`Entering email: ${email}`);
        const emailField = this.page.locator(this.emailInput);
        await emailField.waitFor({ state: 'visible', timeout: 30000 });
        await emailField.fill('');
        await emailField.fill(email);
    }

    async enterPassword(password) {
        console.log(`Entering password`);
        const passwordField = this.page.locator(this.passwordInput);
        await passwordField.waitFor({ state: 'visible', timeout: 30000 });
        await passwordField.fill(password);
    }

    async clickLoginButton() {
        console.log('Clicking Login button');
        const loginBtn = this.page.locator(this.loginBtn);
        await loginBtn.waitFor({ state: 'visible', timeout: 30000 });
        await loginBtn.click();
    }

    // Handles "Launch Workspace" or other buttons
    async clickButtonByText(text) {
        const btnSelector = this.genericBtn(text);
        console.log(`Clicking button with text: ${text}`);
        await this.page.locator(btnSelector).first().waitFor({ state: 'visible', timeout: 30000 });
        await this.page.click(btnSelector);
    }

    async getCurrentUrl() {
        await this.page.waitForLoadState('domcontentloaded');
        return this.page.url();
    }
}

module.exports = { LoginPage };
