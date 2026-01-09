const { Before, AfterAll, After, setDefaultTimeout } = require('@cucumber/cucumber');

// Set default step timeout to 360 seconds (6 minutes)
setDefaultTimeout(360 * 1000);
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
    widgetsCreated: 0,
    pagesCreated: 0,
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

    // Calculate totals for current run
    const details = global.testResults.imports.details;
    global.testResults.imports.total = details.length;
    global.testResults.imports.successful = details.filter(d => d.status === 'success').length;
    global.testResults.imports.failed = details.filter(d => d.status === 'failed').length;
    global.testResults.imports.totalReviews = details.reduce((sum, d) => sum + (d.reviews || 0), 0);

    const reportPath = path.resolve(process.cwd(), 'summary-report.json');
    let finalResults = global.testResults;

    // Merge with existing data if available
    if (fs.existsSync(reportPath)) {
        try {
            const existingData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
            console.log("Merging with existing report data...");

            finalResults = {
                timestamp: existingData.timestamp, // Keep original start timestamp
                imports: {
                    total: (existingData.imports?.total || 0) + global.testResults.imports.total,
                    successful: (existingData.imports?.successful || 0) + global.testResults.imports.successful,
                    failed: (existingData.imports?.failed || 0) + global.testResults.imports.failed,
                    totalReviews: (existingData.imports?.totalReviews || 0) + global.testResults.imports.totalReviews,
                    details: [...(existingData.imports?.details || []), ...global.testResults.imports.details]
                },
                widgetsCreated: (existingData.widgetsCreated || 0) + global.testResults.widgetsCreated,
                pagesCreated: (existingData.pagesCreated || 0) + global.testResults.pagesCreated,
                // Combine statuses (if any run succeeded, mark somewhat success, or just overwrite last)
                widgetStatus: global.testResults.widgetStatus !== "Not Attempted" ? global.testResults.widgetStatus : existingData.widgetStatus,
                pageStatus: global.testResults.pageStatus !== "Not Attempted" ? global.testResults.pageStatus : existingData.pageStatus
            };
        } catch (e) {
            console.warn("Could not parse existing report, overwriting:", e.message);
        }
    }

    // Write to file
    fs.writeFileSync(reportPath, JSON.stringify(finalResults, null, 4));
    console.log(`Custom Summary Report saved to: ${reportPath}`);
});
