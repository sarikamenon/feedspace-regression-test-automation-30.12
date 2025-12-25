const { When, Then } = require('@cucumber/cucumber');
const { SharePage } = require('../pages/SharePage');

When('I click on the magic link and switch back to the original tab', async function () {
    try {
        if (!this.sharePage) this.sharePage = new SharePage(this.page);
        await this.sharePage.clickMagicLinkAndHandleTab();
    } catch (error) {
        console.error(`Error in "I click on the magic link": ${error.message}`);
    }
});

Then('I click on the close button', async function () {
    try {
        if (!this.sharePage) this.sharePage = new SharePage(this.page);
        await this.sharePage.clickCloseButton();
    } catch (error) {
        console.error(`Error in "I click on the close button": ${error.message}`);
    }
});

Then('I navigate to the Widgets page', async function () {
    try {
        if (!this.sharePage) this.sharePage = new SharePage(this.page);
        await this.sharePage.navigateToWidgets();
    } catch (error) {
        console.error(`Error navigating to widgets: ${error.message}`);
    }
});
