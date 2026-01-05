const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { CreativeSpacePage } = require('../pages/CreativeSpacePage');

let creativePage;

When('the user navigates to the Creative Space page via the menu', async function () {
    try {
        creativePage = new CreativeSpacePage(this.page);
        await creativePage.navigate();
    } catch (error) {
        console.error(`Error in "the user navigates to the Creative Space page via the menu": ${error.message}`);
        throw error;
    }
});

Then('the Creative Space page should be displayed', async function () {
    try {
        const isDisplayed = await creativePage.isPageDisplayed();
        expect(isDisplayed).toBe(true);
    } catch (error) {
        console.error(`Error in "the Creative Space page should be displayed": ${error.message}`);
        throw error;
    }
});

When('the user clicks the Create Image button', async function () {
    try {
        await creativePage.clickCreateImage();
    } catch (error) {
        console.error(`Error in "the user clicks the Create Image button": ${error.message}`);
        throw error;
    }
});

Then('the Create Image modal should be displayed', async function () {
    try {
        const isDisplayed = await creativePage.isCreateImageModalDisplayed();
        expect(isDisplayed).toBe(true);
    } catch (error) {
        console.error(`Error in "the Create Image modal should be displayed": ${error.message}`);
        throw error;
    }
});

When('the user selects a review from the list', async function () {
    try {
        await creativePage.selectReview();
    } catch (error) {
        console.error(`Error in "the user selects a review from the list": ${error.message}`);
        throw error;
    }
});

When('the user clicks on an image template from the list', async function () {
    try {
        await creativePage.selectTemplate();
    } catch (error) {
        console.error(`Error in "the user clicks on an image template from the list": ${error.message}`);
        throw error;
    }
});

When('the user clicks the Save Image button', async function () {
    try {
        this.download = await creativePage.clickSaveImage();
    } catch (error) {
        console.error(`Error in "the user clicks the Save Image button": ${error.message}`);
        throw error;
    }
});

Then('the image should be downloaded successfully', async function () {
    try {
        expect(this.download).toBeDefined();
        const filename = this.download.suggestedFilename();
        console.log(`Verified download of file: ${filename}`);
        expect(filename).toBeTruthy();
    } catch (error) {
        console.error(`Error in "the image should be downloaded successfully": ${error.message}`);
        throw error;
    }
});

When('the user clicks the Close button', async function () {
    try {
        await creativePage.clickCloseButton();
    } catch (error) {
        console.error(`Error in "the user clicks the Close button": ${error.message}`);
        throw error;
    }
});

Then('the Create Image modal should be closed', async function () {
    try {
        const isClosed = await creativePage.isModalClosed();
        expect(isClosed).toBe(true);
    } catch (error) {
        console.error(`Error in "the Create Image modal should be closed": ${error.message}`);
        throw error;
    }
});
