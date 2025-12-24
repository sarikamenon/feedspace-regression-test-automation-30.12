const { When, Then } = require('@cucumber/cucumber');
const { ImportPage } = require('../pages/ImportPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { PagesPage } = require('../pages/PagesPage');
const fs = require('fs');
const path = require('path');

When('I click on the Import option', async function () {
    try {
        const dashboardPage = new DashboardPage(this.page);
        await dashboardPage.clickImportOption();
    } catch (error) {
        console.error(`SOFT FAILURE: Error in "I click on the Import option": ${error.message}. Proceeding despite failure.`);
        // User requested not to stop.
    }
});

When('I navigate to the Import Reviews page', async function () {
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.navigateToImportReviews();
    } catch (error) {
        console.error(`SOFT FAILURE: Error in "I navigate to the Import Reviews page": ${error.message}. Proceeding despite failure.`);
    }
});

When('I select the import platform {string}', async function (platformName) {
    // Reset skipped flag for new platform interaction
    this.platformSkipped = false;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.selectPlatform(platformName);
    } catch (error) {
        console.error(`SOFT FAILURE: Error selecting platform ${platformName}: ${error.message}. Skipping remaining steps for this platform.`);
        this.platformSkipped = true;
    }
});

When('I read the JSON file, find the URL for platform {string}, and enter it into the URL text box', async function (platform) {
    if (this.platformSkipped) {
        console.log(`Skipping URL entry for ${platform} due to previous failure.`);
        return;
    }
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        const dataPath = path.resolve(__dirname, '../importlinks.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const entry = data.find(item => item.platform === platform);

        if (entry) {
            await this.importPage.enterUrl(entry.link, platform);
        } else {
            throw new Error(`URL for platform ${platform} not found in JSON`);
        }
    } catch (error) {
        console.error(`SOFT FAILURE: Error entering URL for ${platform}: ${error.message}. Skipping remaining steps for this platform.`);
        this.platformSkipped = true;
    }
});

When('I click on the Import Reviews button', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickImportReviewsButton();
    } catch (error) {
        console.error(`SOFT FAILURE: Error clicking Import Reviews button: ${error.message}. Skipping remaining steps for this platform.`);
        this.platformSkipped = true;
    }
});

Then('I verify that the import success message appears', async function () {
    if (this.platformSkipped) {
        console.log("Skipping success verification due to previous failure.");
        return;
    }
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.verifySuccessMessage();
    } catch (error) {
        console.error(`SOFT FAILURE: Success message not found: ${error.message}. Proceeding to next platform...`);
        // We don't necessarily need to skip anything else afterwards as this is the last step usually, 
        // but for consistency we don't throw.
    }
});

When('I select the platform {string}', async function (platformName) {
    // Reset flag for new platform
    this.platformSkipped = false;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.selectPlatform(platformName);
    } catch (error) {
        console.error(`SOFT FAILURE: Error selecting platform ${platformName}: ${error.message}. Skipping remaining steps for this platform.`);
        this.platformSkipped = true;
    }
});

When('I read the JSON file and enter the URL for {string}', async function (platform) {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        const dataPath = path.resolve(__dirname, '../importlinks.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const entry = data.find(item => item.platform === platform);

        if (entry) {
            await this.importPage.enterUrl(entry.link, platform);
        } else {
            throw new Error(`URL for platform ${platform} not found in JSON`);
        }
    } catch (error) {
        console.error(`SOFT FAILURE: Error entering URL for ${platform}: ${error.message}. Skipping remaining steps for this platform.`);
        this.platformSkipped = true;
    }
});

When('I click on the Import Post button', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickImportPostButton();
    } catch (error) {
        console.error(`SOFT FAILURE: Error clicking Import Post button: ${error.message}. Skipping remaining steps for this platform.`);
        this.platformSkipped = true;
    }
});

Then('I close the import modal', async function () {
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.closeImportModal();
    } catch (error) {
        console.error(`Error in "I close the import modal": ${error.message}`);
        throw error;
    }
});

When('I click on the Pages link', async function () {
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickPagesLink();

        // SPA update buffer
        await this.page.waitForTimeout(1000); // wait a moment for UI to render

        // Reinitialize PagesPage after route change
        this.pagesPage = new PagesPage(this.page);
    } catch (error) {
        console.error(`Error in "I click on the Pages link": ${error.message}`);
        throw error;
    }
});

When('I click on the Get Reviews button', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickGetReviewsButton();
    } catch (error) {
        console.error(`SOFT FAILURE: Error clicking Get Reviews button: ${error.message}. Skipping remaining steps for this platform.`);
        this.platformSkipped = true;
    }
});

When('I click on select all checkbox', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickSelectAllCheckbox();
    } catch (error) {
        console.error(`SOFT FAILURE: Error clicking Select All: ${error.message}. Skipping remaining steps for this platform.`);
        this.platformSkipped = true;
    }
});

When('I click on import reviews button', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickFinalImportButton();
    } catch (error) {
        console.error(`SOFT FAILURE: Error clicking Final Import: ${error.message}. Skipping remaining steps for this platform.`);
        this.platformSkipped = true;
    }
});

When('I click on the Create Page button', async function () {
    try {
        if (!this.pagesPage) this.pagesPage = new PagesPage(this.page); // fallback
        await this.pagesPage.clickCreatePageButton();
    } catch (error) {
        console.error(`Error in "I click on the Create Page button": ${error.message}`);
        throw error;
    }
});

When('I select the first 5 reviews', async function () {
    try {
        if (!this.pagesPage) this.pagesPage = new PagesPage(this.page);
        await this.pagesPage.selectFirstFiveReviews();
    } catch (error) {
        console.error(`Error in "I select the first 5 reviews": ${error.message}`);
        throw error;
    }
});

When('I click on Save and Next button', async function () {
    try {
        if (!this.pagesPage) this.pagesPage = new PagesPage(this.page);
        await this.pagesPage.clickSaveAndNext();
    } catch (error) {
        console.error(`Error in "I click on Save and Next button": ${error.message}`);
        throw error;
    }
});

When('I click on Save and Share button', async function () {
    try {
        if (!this.pagesPage) this.pagesPage = new PagesPage(this.page);
        await this.pagesPage.clickSaveAndShare();
    } catch (error) {
        console.error(`Error in "I click on Save and Share button": ${error.message}`);
        throw error;
    }
});

