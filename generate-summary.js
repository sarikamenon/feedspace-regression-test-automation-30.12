const fs = require('fs');
const path = require('path');

const summaryPath = path.join(__dirname, 'summary-report.json');

if (fs.existsSync(summaryPath)) {
    try {
        const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
        console.log("--------------------------------------------------");
        console.log("             CUSTOM EXECUTION SUMMARY             ");
        console.log("--------------------------------------------------");
        console.log(`Total Imports:     ${summary.imports.total}`);
        console.log(`Successful:        ${summary.imports.successful}`);
        console.log(`Failed:            ${summary.imports.failed}`);
        console.log(`Total Reviews:     ${summary.imports.totalReviews}`);
        console.log(`Widget Status:     ${summary.widgetStatus}`);
        console.log(`Page Status:       ${summary.pageStatus}`);
        console.log("--------------------------------------------------");
        console.log("\nDetails:");
        summary.imports.details.forEach(d => {
            console.log(`[${d.status.toUpperCase()}] ${d.platform} - ${d.reviews} reviews ${d.error ? `(Error: ${d.error})` : ''}`);
        });
        console.log("--------------------------------------------------");
    } catch (err) {
        console.error("Error parsing summary-report.json:", err);
    }
} else {
    console.log("summary-report.json not found. Run tests to generate it.");
}
