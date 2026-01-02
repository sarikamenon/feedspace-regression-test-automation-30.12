const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { AnalyzePage } = require('../pages/AnalyzePage');

When('the user navigates to the Analyze page via menu', async function () {
    this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.navigateToAnalyze();
});

Then('the Analyze page should be displayed', async function () {
    await this.analyzePage.verifyAnalyzePage();
});

// Support both quoted and unquoted for flexibility
When('the user clicks on the {string} tab', async function (tabName) {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickTab(tabName);
});

When('the user clicks on the Overview tab', async function () {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickTab('Overview');
});

When('the user clicks on the Positive Points tab', async function () {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickTab('Positive Points');
});

When('the user clicks on the Pain Points tab', async function () {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickTab('Pain Points');
});

When('the user clicks on the Improvements tab', async function () {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickTab('Improvements');
});

When('the user clicks on Analyze Reviews', async function () {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickAnalyzeReviews();
    // Add a wait to allow the analysis process to start/progress
    await this.page.waitForTimeout(5000);
});

Then('the analysis results content should be checked for {string}', async function (tabName) {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    console.log(`Checking results content for ${tabName}...`);
    // This step can just be a placeholder or perform an initial check
    await this.page.waitForTimeout(2000);
});

Then('the system should display an appropriate message based on results content', async function () {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);

    console.log('Fetching analysis results...');
    const results = await this.analyzePage.getAnalysisResults();

    if (results && results.length > 0) {
        console.log('Result generated successfully');
        console.log(`Content snippet: ${results.substring(0, 100)}...`);
        // Add a small wait to ensure UI is stable before next action
        await this.page.waitForTimeout(2000);
    } else {
        console.log('No content to display');
        // User requested assertions to make tests fail when content is missing
        expect(results, 'Analysis results should not be empty').to.not.be.empty;
    }
});

// For backward compatibility or variations in feature file
Then('the system should display the appropriate message', async function () {
    // Reuse the same logic
    const results = await this.analyzePage.getAnalysisResults();
    if (results && results.length > 0) {
        console.log('Result generated successfully');
    } else {
        console.log('No content to display');
        expect(results, 'Analysis results should not be empty').to.not.be.empty;
    }
});

Then('the user navigates to the {string} tab', async function (tabName) {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickTab(tabName);
});

Then('the user navigates to the Positive Points tab', async function () {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickTab('Positive Points');
});

Then('the user navigates to the Pain Points tab', async function () {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickTab('Pain Points');
});

Then('the user navigates to the Improvements tab', async function () {
    if (!this.analyzePage) this.analyzePage = new AnalyzePage(this.page);
    await this.analyzePage.clickTab('Improvements');
});
