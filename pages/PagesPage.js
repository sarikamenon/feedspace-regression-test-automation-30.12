const { expect } = require('@playwright/test');

class PagesPage {
    constructor(page) {
        this.page = page;
    }

    // Fixed the locator and the variable references
    async clickCreatePageButton() {
        console.log('Clicking on the Create Page button');

        // Allow some time for the page to transition
        await this.page.waitForLoadState('domcontentloaded');

        // Try getting by Role first (Best Practice)
        const btnRole = this.page.getByRole('button', { name: /create page/i });

        // Specific locators based on analysis
        const btnEmpty = this.page.locator('#page-list-nodata button:has-text("Create Page")');
        const btnExists = this.page.locator('button.page-name-modal:has-text("Create Page")');

        let btn;

        try {
            if (await btnRole.count() > 0 && await btnRole.first().isVisible()) {
                console.log('Found Create Page button by Role');
                btn = btnRole.first();
            } else if (await btnEmpty.isVisible().catch(() => false)) {
                console.log('Found Create Page button (Empty State)');
                btn = btnEmpty;
            } else if (await btnExists.isVisible().catch(() => false)) {
                console.log('Found Create Page button (Existing Pages)');
                btn = btnExists;
            } else {
                // Fallback to text if neither specific structure is found. Ensure it is visible.
                console.log('Specific locators not found, trying generic fallback with visibility check...');
                // select any button with text "Create Page" that is actually visible
                btn = this.page.locator('button:has-text("Create Page")').locator('visible=true').first();
            }

            if (!btn) {
                // Last ditch effort: waiting for the generic button
                console.log('Waiting for any "Create Page" button to appear...');
                btn = this.page.locator('button:has-text("Create Page")').first();
                await btn.waitFor({ state: 'visible', timeout: 5000 });
            }

            await btn.waitFor({ state: 'visible', timeout: 30000 });
            await btn.click();
            console.log('Clicked on the Create Page button');

        } catch (error) {
            console.error('Error clicking Create Page button:', error);
            throw new Error(`Failed to click "Create Page" button. \nLocators tried:\n- Role: button w/ "Create Page"\n- ID: #page-list-nodata button\n- Class: button.page-name-modal\n- Text: "Create Page"`);
        }
    }

    async selectFirstFiveReviews() {
        console.log('Selecting first 5 reviews...');
        const container = this.page.locator('#page-feed-list-container');

        await container.waitFor({ state: 'visible', timeout: 60000 });

        // Try a more generic selector if input[type="checkbox"] fails, but usually it exists.
        // If the user says "not selected", maybe they are custom divs? 
        // But stick to input for now with force: true.
        const checkboxes = container.locator('input[type="checkbox"]');

        // Wait for at least one
        try {
            await checkboxes.first().waitFor({ state: 'attached', timeout: 30000 });
        } catch (e) {
            console.log('No checkboxes found!');
        }

        const count = await checkboxes.count();
        console.log(`Found ${count} total checkboxes`);

        let selected = 0;
        for (let i = 0; i < count && selected < 5; i++) {
            const cb = checkboxes.nth(i);
            // Force click in case of overlay/custom styling
            await cb.click({ force: true });
            selected++;
            console.log(`Selected review ${selected}`);
            // Small delay to ensure state update
            await this.page.waitForTimeout(500);
        }
    }

    async clickSaveAndNext() {
        console.log('Clicking Save & Next button...');
        // Using getByRole is more robust for buttons
        const btn = this.page.getByRole('button', { name: /Save & Next/i }).first();
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click();
        console.log('Clicked Save & Next button.');
    }

    async clickSaveAndShare() {
        console.log('Clicking Save & Share button...');
        const btn = this.page.getByRole('button', { name: /Save & Share/i }).first();
        await this.page.waitForTimeout(2000); // Small delay for animations
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click();
        console.log('Clicked Save & Share button.');
    }
}

module.exports = { PagesPage };