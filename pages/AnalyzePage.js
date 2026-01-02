const { expect } = require('@playwright/test');

class AnalyzePage {
    constructor(page) {
        this.page = page;

        // Locators
        this.analyzeMenuLink = page.getByRole('link', { name: /Analyze/i });
        this.analyzeReviewsBtn = page.locator('#analyze-reviews-btn');
        this.analysisResultsContent = page.locator('#analysis-results-content');

        // Tab Locators
        this.tabs = {
            'overview': page.locator("[data-analysis-type='overview']"),
            'positive points': page.locator("[data-analysis-type='positive_points']"),
            'pain points': page.locator("[data-analysis-type='pain_points']"),
            'improvements': page.locator("[data-analysis-type='improvements']")
        };
    }

    async navigateToAnalyze() {
        console.log('Navigating to Analyze page via menu...');
        await this.analyzeMenuLink.waitFor({ state: 'visible', timeout: 30000 });
        await this.analyzeMenuLink.click();
        console.log('Clicked Analyze menu link');
    }

    async verifyAnalyzePage() {
        console.log('Verifying Analyze page URL...');
        await expect(this.page).toHaveURL(/.*\/analyze/);
    }

    async clickTab(tabName) {
        const normalizedTab = tabName.toLowerCase();

        // Try to find the locator from our map
        let tabLocator = this.tabs[normalizedTab];

        // If not predefined or doesn't work, try a more generic selector based on name
        if (!tabLocator) {
            const dataAttr = normalizedTab.replace(/\s+/g, '_');
            tabLocator = this.page.locator(`[data-analysis-type='${dataAttr}']`);
        }

        console.log(`Clicking on ${tabName} tab...`);

        try {
            // First try with long timeout and visibility
            await tabLocator.waitFor({ state: 'visible', timeout: 15000 });
            await tabLocator.click();
        } catch (error) {
            console.warn(`Initial click on ${tabName} failed OR tab not visible. Trying fallback selectors and force click...`);

            // Fallback: search by text within buttons or links
            const fallbackLocator = this.page.locator(`button:has-text("${tabName}"), a:has-text("${tabName}"), [role="tab"]:has-text("${tabName}")`).first();

            try {
                await fallbackLocator.waitFor({ state: 'visible', timeout: 10000 });
                await fallbackLocator.click({ force: true });
            } catch (fallbackError) {
                console.error(`Fallback click also failed for ${tabName}. Error: ${fallbackError.message}`);

                // Final attempt: try clicking the data attribute anyway with force
                const dataAttrFallback = normalizedTab.replace(/\s+/g, '-');
                await this.page.locator(`[data-analysis-type='${dataAttrFallback}']`).click({ force: true }).catch(lastErr => {
                    throw new Error(`Could not click tab "${tabName}" after multiple attempts. ${lastErr.message}`);
                });
            }
        }

        console.log(`${tabName} tab clicked.`);
    }

    async clickAnalyzeReviews() {
        console.log('Clicking Analyze Reviews button...');
        await this.analyzeReviewsBtn.waitFor({ state: 'visible', timeout: 30000 });
        await this.analyzeReviewsBtn.click();
        console.log('Analyze Reviews button clicked.');
    }

    async getAnalysisResults() {
        console.log('Waiting for analysis results content...');
        // Wait for results to appear (can take time)
        await this.analysisResultsContent.waitFor({ state: 'visible', timeout: 60000 });
        const content = await this.analysisResultsContent.textContent();
        return content ? content.trim() : "";
    }
}

module.exports = { AnalyzePage };
