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
        const btnEmpty = this.page.locator('#page-list-nodata button:has-text("Create Page")').first();
        const btnExists = this.page.locator('button:has-text("Create Page")').first();

        let btn;

        try {
            if (await btnEmpty.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log('Found Create Page button (Empty State)');
                btn = btnEmpty;
            } else if (await btnExists.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log('Found Create Page button (Existing Pages or Header)');
                btn = btnExists;
            } else {
                console.log('Trying role-based fallback...');
                btn = this.page.getByRole('button', { name: /create page/i }).first();
            }

            await btn.waitFor({ state: 'visible', timeout: 30000 });
            await btn.click();
            console.log('Clicked on the Create Page button');

            // --- AI HEALING: Check for Name Modal with increased timeout ---
            const nameInput = this.page.locator('input[placeholder*="Name" i], input[name*="name" i]').first();
            const saveBtn = this.page.locator('button:has-text("Save"), button:has-text("Create")').first();

            if (await nameInput.isVisible({ timeout: 15000 }).catch(() => false)) {
                console.log('Detected Page Name modal. Entering name...');
                const pageName = `Automation Page ${new Date().getTime()}`;
                await nameInput.fill(pageName);
                await this.page.waitForTimeout(1000);
                await saveBtn.click();
                console.log(`Page name "${pageName}" entered and saved.`);

                // Explicitly wait for the list container to appear after saving
                console.log('Waiting for review selection container...');
                await this.page.locator('#page-feed-list-container').waitFor({ state: 'visible', timeout: 30000 });
            }

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

    async clickMagicLinkAndClose() {
        console.log('Handling Magic Link flow...');
        const magicLink = this.page.locator('a[href*="feedspace.io/p/"]').first();

        if (await magicLink.isVisible()) {
            console.log('Magic link found, clicking...');
            const [newPage] = await Promise.all([
                this.page.context().waitForEvent('page'),
                magicLink.click()
            ]);

            await newPage.waitForLoadState('domcontentloaded');
            console.log(`Opened magic link share page: ${newPage.url()}`);

            // Switch back to original page and close the new tab
            await this.page.bringToFront();
            await newPage.close();
            console.log('Switched back and closed magic link tab.');
        }

        // Click the final close button on the modal if it exists
        const closeBtn = this.page.locator('button.close-modal, button#yt-import-modal-close, button:has-text("Close")').first();
        if (await closeBtn.isVisible()) {
            await closeBtn.click();
            console.log('Closed the shared modal.');
        }
    }
}

module.exports = { PagesPage };