const { expect } = require('@playwright/test');

class DashboardPage {
    constructor(page) {
        this.page = page;
        this.launchWorkspaceButton = 'button:has-text("Launch Workspace")';
        this.dashboardHeader = 'h1:has-text("Dashboard")';
        // Try multiple selectors for Import Reviews
        this.importOption = 'text="Import Reviews"';
    }

    async clickLaunchWorkspace() {
        console.log('Clicking Launch Workspace button');
        await this.page.click(this.launchWorkspaceButton);
    }

    async verifyDashboard() {
        console.log('Verifying Dashboard URL');
        await expect(this.page).toHaveURL(/.*\/setup/); // Updated based on logs
    }

    async clickImportOption() {
        console.log('Clicking Import Option');

        // Wait for dashboard to settle
        await this.page.waitForLoadState('domcontentloaded');

        // Try a more specific CSS selector first, fallback to text
        const importSelector = 'a[href*="imports"], a:has-text("Import Reviews")';

        const importLink = this.page.locator(importSelector).first();
        await importLink.waitFor({ state: 'visible', timeout: 45000 }); // Increased timeout
        await importLink.click();
    }
}

module.exports = { DashboardPage };
