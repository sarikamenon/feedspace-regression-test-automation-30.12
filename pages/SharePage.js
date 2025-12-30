const { expect } = require('@playwright/test');

class SharePage {
    constructor(page) {
        this.page = page;
        this.magicLinkBtn = '.js-clipboard-default';
        this.closeBtn = this.page.getByRole('button', { name: 'Close' });
        // User provided locator for widget close
        this.widgetCloseBtn = 'button[id="widget-edit-form-close-btn"]';
    }

    async clickMagicLinkAndHandleTab() {
        console.log('Clicking Magic Link...');

        const popupPromise = this.page.waitForEvent('popup');

        await this.page.locator(this.magicLinkBtn).first().waitFor({
            state: 'visible',
            timeout: 30000
        });

        await this.page.locator(this.magicLinkBtn).first().click();

        const popup = await popupPromise;
        console.log('New tab opened via magic link');

        await popup.waitForLoadState('domcontentloaded');

        // Switch back to original page
        await this.page.bringToFront();
        console.log('Switched back to original tab');
    }

    async clickCloseButton() {
        console.log('Clicking Close button');
        const widgetClose = this.page.locator(this.widgetCloseBtn).first();
        const shareClose = this.closeBtn.first();

        if (await widgetClose.isVisible()) {
            console.log('Found widget close button');
            await widgetClose.click();
        } else {
            console.log('Found generic share close button (or waiting for it)');
            await shareClose.waitFor({ state: 'visible', timeout: 30000 });
            await shareClose.click();
        }
    }

    async navigateToWidgets() {
        console.log('Navigating to Widgets page...');
        await this.page.goto('https://app.feedspace.io/widgets', { waitUntil: 'domcontentloaded' });
        console.log('Navigated to Widgets page');
    }
}

module.exports = { SharePage };
