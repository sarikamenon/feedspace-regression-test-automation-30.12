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

    await this.pagesPage.clickCreatePageButton();
    await this.pagesPage.selectFirstFiveReviews();
    await this.pagesPage.clickSaveAndNext();
    await this.pagesPage.clickSaveAndNext(); // Second step
    await this.pagesPage.clickSaveAndShare();
    await this.pagesPage.clickMagicLinkAndClose();
});

When('I execute the Carousel Widget flow with first 5 reviews', async function () {
    if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);

    await this.widgetsPage.selectCarouselTemplate();
    await this.widgetsPage.selectFirstFiveWidgetReviews();
    await this.widgetsPage.clickSaveAndNext();
    await this.widgetsPage.clickSaveAndShare();
    await this.widgetsPage.clickWidgetPreview();
});

Then('I generate the final execution summary report', async function () {
    const importSummary = this.importPage.getImportSummary();
    const reportPath = path.resolve(__dirname, '..', 'summary-report.json');

    const finalReport = {
        timestamp: new Date().toISOString(),
        imports: importSummary,
        widgetStatus: 'Created Successfully',
        pageStatus: 'Created Successfully'
    };

    fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
    console.log('\n=======================================');
    console.log('       FINAL EXECUTION SUMMARY         ');
    console.log('=======================================');
    console.log(`Total Platforms: ${importSummary.total}`);
    console.log(`Successful:      ${importSummary.successful}`);
    console.log(`Failed:          ${importSummary.failed}`);
    console.log(`Total Reviews:   ${importSummary.totalReviews}`);
    console.log('=======================================\n');
});
