const reporter = require('cucumber-html-reporter');

const fs = require('fs');
const path = require('path');

let summaryData = {};
try {
    const summaryPath = path.resolve(process.cwd(), 'summary-report.json');
    if (fs.existsSync(summaryPath)) {
        summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    }
} catch (e) {
    console.log('Could not load summary-report.json for metadata enrichment');
}

const options = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber-report.json',
    output: 'reports/cucumber-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "STAGING",
        "Browser": "Chrome/Playwright",
        "Total Imports": summaryData.imports?.total || 0,
        "Total Reviews": summaryData.imports?.totalReviews || 0,
        "Widgets Created": summaryData.widgetsCreated || 0,
        "Pages Created": summaryData.pagesCreated || 0,
        "Executed": "GitHub Actions"
    },
    failedSummaryReport: true,
};

reporter.generate(options);
