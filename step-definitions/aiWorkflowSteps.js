const { When, Then } = require('@cucumber/cucumber');
const { ImportPage } = require('../pages/ImportPage');
const { PagesPage } = require('../pages/PagesPage');
const { WidgetsPage } = require('../pages/WidgetsPage');
const fs = require('fs');
const path = require('path');

When('I execute dynamic imports for all platforms in {string}', async function (jsonFile) {
    const dataPath = path.resolve(__dirname, '..', jsonFile);
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    if (!this.importPage) this.importPage = new ImportPage(this.page);

    await this.importPage.clickImportOption();
    await this.importPage.navigateToImportReviews();

    for (const entry of data) {
        console.log(`\n--- Starting loop for: ${entry.platform} ---`);
        await this.importPage.detectAndImportFlow(entry.platform, entry.link);
    }
});

When('I verify Facebook Reviews import success', async function () {
    if (!this.importPage) this.importPage = new ImportPage(this.page);
    // This is already tracked in the status object if it was in the loop, 
    // but the requirement asks for explicit verification.
    await this.importPage.selectPlatform('Facebook Reviews');
    await this.importPage.verifySuccessMessage();
    await this.importPage.closeImportModal();
});

When('I execute the full Page creation flow with first 5 reviews', async function () {
    if (!this.pagesPage) this.pagesPage = new PagesPage(this.page);
    this.pageCreated = false;

    try {
        await this.pagesPage.clickCreatePageButton();
        await this.pagesPage.selectFirstFiveReviews();
        await this.pagesPage.clickSaveAndNext();
        await this.pagesPage.clickSaveAndNext(); // Second step
        await this.pagesPage.clickSaveAndShare();
        await this.pagesPage.clickMagicLinkAndClose();
        this.pageCreated = true;
        console.log('Page Creation flow completed successfully.');
    } catch (error) {
        console.error(`SOFT FAILURE in Page Creation: ${error.message}`);
        // Ensure we try to close any open modals before continuing
        try {
            const closeBtn = this.page.locator('button.close-modal, button#yt-import-modal-close, button:has-text("Close")').first();
            if (await closeBtn.isVisible()) await closeBtn.click();
        } catch (e) { }
    }
});

When('I execute the Carousel Widget flow with first 5 reviews', async function () {
    if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
    this.widgetCreated = false;

    try {
        await this.widgetsPage.selectCarouselTemplate();
        await this.widgetsPage.selectFirstFiveWidgetReviews();
        await this.widgetsPage.clickSaveAndNext();
        await this.widgetsPage.clickSaveAndShare();
        await this.widgetsPage.clickWidgetPreview();
        this.widgetCreated = true;
        console.log('Widget Creation flow completed successfully.');
    } catch (error) {
        console.error(`SOFT FAILURE in Widget Creation: ${error.message}`);
    }
});

Then('I generate the final execution summary report', async function () {
    const importSummary = this.importPage ? this.importPage.getImportSummary() : { total: 0, successful: 0, failed: 0, totalReviews: 0, details: [] };
    const reportPath = path.resolve(__dirname, '..', 'summary-report.json');

    const finalReport = {
        timestamp: new Date().toISOString(),
        imports: importSummary,
        widgetStatus: this.widgetCreated ? 'Created Successfully' : 'Failed',
        pageStatus: this.pageCreated ? 'Created Successfully' : 'Failed'
    };

    fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
    console.log('\n=======================================');
    console.log('       FINAL EXECUTION SUMMARY         ');
    console.log('=======================================');
    console.log(`Total Platforms: ${importSummary.total}`);
    console.log(`Successful:      ${importSummary.successful}`);
    console.log(`Failed:          ${importSummary.failed}`);
    console.log(`Total Reviews:   ${importSummary.totalReviews}`);
    console.log(`Page Creation:   ${finalReport.pageStatus}`);
    console.log(`Widget Creation: ${finalReport.widgetStatus}`);
    console.log('=======================================\n');
});
