const { Before, AfterAll, After } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

// Global results object to track execution statistics
global.testResults = {
    timestamp: new Date().toISOString(),
    imports: {
        total: 0,
        successful: 0,
        failed: 0,
        totalReviews: 0,
        details: []
    },
    widgetStatus: "Not Attempted",
    pageStatus: "Not Attempted"
};

Before(async function () {
    // any setup needed before scenarios
});

After(async function (scenario) {
    // optional: capture screenshot on failure here if not handled elsewhere
});

AfterAll(async function () {
    console.log("Generating Custom Summary Report...");

    // Calculate totals
    const details = global.testResults.imports.details;
    global.testResults.imports.total = details.length;
    global.testResults.imports.successful = details.filter(d => d.status === 'success').length;
    global.testResults.imports.failed = details.filter(d => d.status === 'failed').length;
    global.testResults.imports.totalReviews = details.reduce((sum, d) => sum + (d.reviews || 0), 0);

    // Write to file
    const reportPath = path.resolve(process.cwd(), 'summary-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(global.testResults, null, 4));
    console.log(`Custom Summary Report saved to: ${reportPath}`);
});
