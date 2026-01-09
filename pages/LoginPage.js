class LoginPage {
    constructor(page) {
        this.page = page;
        this.url = 'https://app.feedspace.io/signin';

        // Locators
        this.emailInput = '#email';
        this.passwordInput = '#password';
        this.loginBtn = '#loginButton';

        // Generic button locator by text
        this.genericBtn = (text) => `button:has-text("${text}")`;
    }

    async navigate(url) {
        const targetUrl = url || this.url;
        console.log(`Navigating to ${targetUrl}`);
        await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        // Optional: wait for a key element instead of full network idle if needed
    }

    async enterEmail(email) {
        console.log(`Entering email using keyboard: ${email}`);
        const emailField = this.page.locator(this.emailInput);

        // Wait for visibility AND enabled state
        await emailField.waitFor({ state: 'visible', timeout: 30000 });
        // Standard Playwright check for enabled
        const isEnabled = await emailField.isEnabled();
        if (!isEnabled) {
            console.log('Email field not enabled yet, waiting...');
            await emailField.waitFor({ state: 'visible', timeout: 10000 }); // Retry wait or just wait longer
        }

        await emailField.click();
        await this.page.waitForTimeout(500); // Focus stability

        // Clear field safely (Ctrl+A -> Backspace)
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');

        // Type slowly
        await this.page.keyboard.type(email, { delay: 100 });
    }

    async enterPassword(password) {
        console.log(`Entering password using keyboard`);
        const passwordField = this.page.locator(this.passwordInput);

        await passwordField.waitFor({ state: 'visible', timeout: 30000 });
        await passwordField.click();
        await this.page.waitForTimeout(500);

        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');

        await this.page.keyboard.type(password, { delay: 100 });
    }

    async clickLoginButton() {
        console.log('Clicking Login button');
        const loginBtn = this.page.locator(this.loginBtn);
        await loginBtn.waitFor({ state: 'visible', timeout: 30000 });
        await loginBtn.click();
    }

    // Generic click by button text
    async clickButtonByText(text) {
        console.log(`Clicking button/element with text: ${text}`);
        // Try precise button first, then link, then generic text
        const btn = this.page.locator(`button:has-text("${text}")`)
            .or(this.page.locator(`a:has-text("${text}")`))
            .or(this.page.getByRole('button', { name: text }))
            .or(this.page.getByText(text));

        await btn.first().waitFor({ state: 'visible', timeout: 30000 });
        await btn.first().click();
    }

    async getCurrentUrl() {
        await this.page.waitForLoadState('domcontentloaded');
        return this.page.url();
    }
}

module.exports = { LoginPage };
