const { When, Then } = require('@cucumber/cucumber');
const { WidgetsPage } = require('../pages/WidgetsPage');

When('I navigate to the Widgets page via menu', async function () {
    try {
        if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
        await this.widgetsPage.navigateToWidgets();
    } catch (error) {
        console.error(`Error navigating to widgets: ${error.message}`);
        global.testResults.widgetStatus = "Failed";
        throw error;
    }
});

When('I select the Carousel template', async function () {
    try {
        if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
        await this.widgetsPage.selectCarouselTemplate();
    } catch (error) {
        console.error(`Error selecting carousel: ${error.message}`);
        global.testResults.widgetStatus = "Failed";
        throw error;
    }
});

When('I select the first 5 reviews for the widget', async function () {
    try {
        if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
        await this.widgetsPage.selectFirstFiveWidgetReviews();
    } catch (error) {
        console.error(`Error selecting widget reviews: ${error.message}`);
        global.testResults.widgetStatus = "Failed";
        throw error;
    }
});

When('I click on Save and Next on widget page', async function () {
    try {
        if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
        await this.widgetsPage.clickSaveAndNext();
    } catch (error) {
        console.error(`Error clicking Save and Next (Widget): ${error.message}`);
        global.testResults.widgetStatus = "Failed";
        throw error;
    }
});

When('I click on Save and Share on widget page', async function () {
    try {
        if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
        await this.widgetsPage.clickSaveAndShare();
        global.testResults.widgetStatus = "Created Successfully";
    } catch (error) {
        console.error(`Error clicking Save and Share (Widget): ${error.message}`);
        global.testResults.widgetStatus = "Failed";
        throw error;
    }
});

Then('I click on the Widget Preview button', async function () {
    try {
        if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
        await this.widgetsPage.clickWidgetPreview();
    } catch (error) {
        console.error(`Error clicking Widget Preview: ${error.message}`);
        // Don't fail the whole test on preview button
    }
});
