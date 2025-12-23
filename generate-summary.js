const fs = require('fs');
const path = require('path');

function generateSummary() {
    const summaryPath = path.resolve(__dirname, 'summary-report.json');
    const githubSummaryPath = process.env.GITHUB_STEP_SUMMARY;

    if (!fs.existsSync(summaryPath)) {
        console.error('Summary report file not found.');
        return;
    }

    const report = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    const imports = report.imports;

    let markdown = `
# 🚀 Feedspace AI-Native Execution Summary

| Metric | Result |
| --- | --- |
| **Status** | ✅ Completed |
| **Total Platforms Attempted** | ${imports.total} |
| **Successful Imports** | ${imports.successful} |
| **Failed Imports** | ${imports.failed} |
| **Total Reviews Imported** | ${imports.totalReviews} |
| **Page/WOL Creation** | ${report.pageStatus} |
| **Widget Creation** | ${report.widgetStatus} |

## 📊 Platform Details
| Platform | Status | Reviews | Error |
| --- | --- | --- | --- |
`;

    imports.details.forEach(item => {
        const icon = item.status === 'success' ? '✅' : '❌';
        markdown += `| ${item.platform} | ${icon} ${item.status} | ${item.reviews} | ${item.error || '-'} |\n`;
    });

    markdown += `\n*Report generated at: ${report.timestamp}*`;

    if (githubSummaryPath) {
        fs.appendFileSync(githubSummaryPath, markdown);
    } else {
        console.log(markdown);
    }
}

generateSummary();
