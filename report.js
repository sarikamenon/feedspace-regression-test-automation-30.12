const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber-report.json',
    output: 'reports/cucumber-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "STAGING",
        "Browser": "Chrome/Playwright",
        "Platform": "Ubuntu",
        "Parallel": "Scenarios",
        "Executed": "GitHub Actions"
    },
    failedSummaryReport: true,
};

console.log('Generating HTML report...');
reporter.generate(options);
console.log('HTML report generated successfully at reports/cucumber-report.html');
