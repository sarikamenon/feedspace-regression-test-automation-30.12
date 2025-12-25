const { When, Then, Given } = require('@cucumber/cucumber');
const { ImportPage } = require('../pages/ImportPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { PagesPage } = require('../pages/PagesPage');
const fs = require('fs');
const path = require('path');

// Helper to update global results
function updateResult(platform, status, reviews = 0, error = null) {
    if (!global.testResults) return; // Should be init in hooks.js
    const existingIndex = global.testResults.imports.details.findIndex(d => d.platform === platform);

    if (existingIndex >= 0) {
        // Update existing
        if (status) global.testResults.imports.details[existingIndex].status = status;
        if (reviews) global.testResults.imports.details[existingIndex].reviews = reviews;
        if (error) global.testResults.imports.details[existingIndex].error = error;
    } else {
        // Add new
        global.testResults.imports.details.push({
            platform: platform,
            status: status || 'pending',
            reviews: reviews || 0,
            error: error
        });
    }
}

// Helper to get current platform safely
function getCurrentPlatform(context) {
    return context.importPage ? context.importPage.currentPlatform : null;
}

When('I click on the Import option', async function () {
    try {
        const dashboardPage = new DashboardPage(this.page);
        await dashboardPage.clickImportOption();
    } catch (error) {
        console.error(`SOFT FAILURE: Error in "I click on the Import option": ${error.message}.`);
    }
});

When('I navigate to the Import Reviews page', async function () {
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.navigateToImportReviews();
    } catch (error) {
        console.error(`SOFT FAILURE: Error in "I navigate to the Import Reviews page": ${error.message}.`);
    }
});

When('I select the import platform {string}', async function (platformName) {
    this.platformSkipped = false;
    updateResult(platformName, 'pending');
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.selectPlatform(platformName);
    } catch (error) {
        console.error(`SOFT FAILURE: Error selecting platform ${platformName}: ${error.message}.`);
        this.platformSkipped = true;
        updateResult(platformName, 'failed', 0, error.message);
    }
});

When('I select the platform {string}', async function (platformName) {
    this.platformSkipped = false;
    updateResult(platformName, 'pending');
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.selectPlatform(platformName);
    } catch (error) {
        console.error(`SOFT FAILURE: Error selecting platform ${platformName}: ${error.message}.`);
        this.platformSkipped = true;
        updateResult(platformName, 'failed', 0, error.message);
    }
});

When('I read the JSON file, find the URL for platform {string}, and enter it into the URL text box', async function (platform) {
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
        console.error(`SOFT FAILURE: Error entering URL for ${platform}: ${error.message}.`);
        this.platformSkipped = true;
        updateResult(platform, 'failed', 0, error.message);
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
        console.error(`SOFT FAILURE: Error entering URL for ${platform}: ${error.message}.`);
        this.platformSkipped = true;
        updateResult(platform, 'failed', 0, error.message);
    }
});

When('I click on the Import Reviews button', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickImportReviewsButton();
    } catch (error) {
        const platform = getCurrentPlatform(this);
        console.error(`SOFT FAILURE: Error clicking Import Reviews button: ${error.message}.`);
        this.platformSkipped = true;
        if (platform) updateResult(platform, 'failed', 0, error.message);
    }
});

When('I click on the Import Post button', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickImportPostButton();
    } catch (error) {
        const platform = getCurrentPlatform(this);
        console.error(`SOFT FAILURE: Error clicking Import Post button: ${error.message}.`);
        this.platformSkipped = true;
        if (platform) updateResult(platform, 'failed', 0, error.message);
    }
});

When('I click on the Get Reviews button', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickGetReviewsButton();
    } catch (error) {
        const platform = getCurrentPlatform(this);
        console.error(`SOFT FAILURE: Error clicking Get Reviews button: ${error.message}.`);
        this.platformSkipped = true;
        if (platform) updateResult(platform, 'failed', 0, error.message);
    }
});

When('I click on select all checkbox', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickSelectAllCheckbox();
    } catch (error) {
        const platform = getCurrentPlatform(this);
        console.error(`SOFT FAILURE: Error clicking Select All: ${error.message}.`);
        this.platformSkipped = true;
        if (platform) updateResult(platform, 'failed', 0, error.message);
    }
});

When('I click on import reviews button', async function () {
    if (this.platformSkipped) return;
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickFinalImportButton();
    } catch (error) {
        const platform = getCurrentPlatform(this);
        console.error(`SOFT FAILURE: Error clicking Final Import: ${error.message}.`);
        this.platformSkipped = true;
        if (platform) updateResult(platform, 'failed', 0, error.message);
    }
});

Then('I verify that the import success message appears', async function () {
    if (this.platformSkipped) return;
    const platform = getCurrentPlatform(this);
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.verifySuccessMessage();

        // Extract count
        const count = await this.importPage.getReviewsCount(platform);
        updateResult(platform, 'success', count);

    } catch (error) {
        console.error(`SOFT FAILURE: Success message not found for ${platform}: ${error.message}.`);
        updateResult(platform, 'failed', 0, error.message);
        // Not setting platformSkipped=true here as this is usually the last step
    }
});

Then('I close the import modal', async function () {
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.closeImportModal();
    } catch (error) {
        console.error(`Error in "I close the import modal": ${error.message}`);
        // Non-critical, just log
    }
});

When('I click on the Pages link', async function () {
    try {
        if (!this.importPage) this.importPage = new ImportPage(this.page);
        await this.importPage.clickPagesLink();
        await this.page.waitForTimeout(1000);
        this.pagesPage = new PagesPage(this.page);
    } catch (error) {
        console.error(`Error in "I click on the Pages link": ${error.message}`);
        global.testResults.pageStatus = "Failed";
        // throw error; // Maybe don't throw to allow report generation? 
        // But if pages link fails, widget creation will fail too.
        // Let's not throw, but subsequent steps will likely fail.
    }
});

When('I click on the Create Page button', async function () {
    try {
        if (!this.pagesPage) this.pagesPage = new PagesPage(this.page);
        await this.pagesPage.clickCreatePageButton();
    } catch (error) {
        console.error(`Error in "I click on the Create Page button": ${error.message}`);
        global.testResults.pageStatus = "Failed";
    }
});

When('I select the first 5 reviews', async function () {
    try {
        if (!this.pagesPage) this.pagesPage = new PagesPage(this.page);
        await this.pagesPage.selectFirstFiveReviews();
    } catch (error) {
        console.error(`Error in "I select the first 5 reviews": ${error.message}`);
        global.testResults.pageStatus = "Failed";
    }
});

When('I click on Save and Next button', async function () {
    try {
        if (!this.pagesPage) this.pagesPage = new PagesPage(this.page);
        await this.pagesPage.clickSaveAndNext();
    } catch (error) {
        console.error(`Error in "I click on Save and Next button": ${error.message}`);
        global.testResults.pageStatus = "Failed";
    }
});

When('I click on Save and Share button', async function () {
    try {
        if (!this.pagesPage) this.pagesPage = new PagesPage(this.page);
        await this.pagesPage.clickSaveAndShare();
        global.testResults.pageStatus = "Created Successfully"; // Tentative success
    } catch (error) {
        console.error(`Error in "I click on Save and Share button": ${error.message}`);
        global.testResults.pageStatus = "Failed";
    }
});

// Widget steps are defined in widgetSteps.js
// Close button and magic link steps are defined in shareSteps.js
