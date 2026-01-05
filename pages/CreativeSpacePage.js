class CreativeSpacePage {
    constructor(page) {
        this.page = page;
        this.url = 'https://app.feedspace.io/creative-space';

        // Locators
        // Use more robust Playwright locators
        this.createImageBtn = page.locator('#creative-space-main-content').getByRole('button', { name: 'Create Image' });

        // Review list items
        this.creativeReviewList = '#creative-review-scroll-container';
        this.reviewItems = 'label.feedbox-card.feedbox-hover-card';

        // Template list items
        this.creativeTemplateList = 'div:has(> button.p-1.rounded-lg.border)';
        this.templateItems = 'button.p-1.rounded-lg.border';

        // Create Image Modal detection
        this.createImageModal = 'text="Marketing Image"';

        // Save Image button
        this.saveImageBtn = '#creative-download-image';

        // Close button - using getByRole for better accessibility
        this.closeBtn = page.getByRole('button', { name: 'Close' });

        // Modal container for verification
        this.modalContainer = '#create-image-modal-wizard';
    }

    async navigate() {
        console.log(`Navigating to ${this.url}`);
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('Successfully navigated to Creative Space');
    }

    async clickCreateImage() {
        console.log('Attempting to open "Create Image" modal...');

        // More specific locator based on user feedback
        // Targeting the button that contains the specific span structure or text
        const btn = this.page.locator('button').filter({ has: this.page.locator('.btn-label', { hasText: 'Create Image' }) }).first();

        // Fallback if the specific structure isn't found
        const fallbackBtn = this.page.locator('button:has-text("Create Image")').first();

        const targetBtn = (await btn.count() > 0) ? btn : fallbackBtn;

        // "Click until Open" Pattern
        const maxRetries = 3;
        for (let i = 0; i < maxRetries; i++) {
            try {
                console.log(`Click attempt ${i + 1}/${maxRetries}`);

                await targetBtn.waitFor({ state: 'visible', timeout: 30000 });
                // Ensure button is stable
                await targetBtn.scrollIntoViewIfNeeded();

                // Small wait to ensure hydration if it's the first attempt
                if (i === 0) await this.page.waitForTimeout(2000);

                await targetBtn.click({ force: false }); // Try normal click first to trigger events properly

                // Wait for the expected effect (Modal appearing)
                // We check for signature elements of the modal
                try {
                    console.log('Waiting for modal to appear...');
                    await Promise.any([
                        this.page.locator('#creative-review-scroll-container').waitFor({ state: 'visible', timeout: 5000 }),
                        this.page.locator('#title-input').waitFor({ state: 'visible', timeout: 5000 }),
                        this.page.locator('text="Marketing Image"').waitFor({ state: 'visible', timeout: 5000 })
                    ]);
                    console.log('Modal appeared successfully!');
                    return; // Success
                } catch (waitError) {
                    console.warn(`Modal did not appear after click attempt ${i + 1}.`);
                    if (i === maxRetries - 1) throw new Error('Modal failed to open after multiple click attempts');

                    // Wait a bit before retrying
                    await this.page.waitForTimeout(1000);
                }

            } catch (error) {
                console.error(`Error during click attempt ${i + 1}: ${error.message}`);
                if (i === maxRetries - 1) throw error;
            }
        }
    }

    async selectReview() {
        console.log('Attempting to select a review');
        const list = this.page.locator(this.creativeReviewList);
        await list.waitFor({ state: 'visible', timeout: 30000 });

        const items = this.page.locator(this.reviewItems);
        // Wait for at least one item to be visible and attached
        await items.first().waitFor({ state: 'visible', timeout: 30000 });

        const count = await items.count();
        console.log(`Found ${count} reviews. Clicking the first one.`);

        // Use a more specific click if needed, or just items.first()
        await items.first().click();
        console.log('Clicked first review');

        // Wait for templates to be populated
        await this.page.waitForTimeout(2000);
    }

    async selectTemplate() {
        console.log('Attempting to select a template');
        const list = this.page.locator(this.templateItems);
        console.log('Waiting for templates to be visible');
        await list.first().waitFor({ state: 'visible', timeout: 30000 });

        const count = await list.count();
        console.log(`Found ${count} templates. Clicking the first one.`);
        await list.first().click();
        console.log('Clicked first template');
    }

    async clickSaveImage() {
        console.log('Clicking Save Image button and waiting for download');
        const downloadPromise = this.page.waitForEvent('download');
        await this.page.locator(this.saveImageBtn).click();
        const download = await downloadPromise;
        console.log(`Download started: ${download.suggestedFilename()}`);
        return download;
    }

    async clickCloseButton() {
        console.log('Attempting to click Close button');

        const closeBtn = this.page.getByRole('button', { name: 'Close' });

        await closeBtn.waitFor({ state: 'visible', timeout: 30000 });
        await closeBtn.click();

        console.log('Clicked Close button');

        // Wait for modal to disappear
        await this.page
            .locator('#create-image-modal-wizard')
            .waitFor({ state: 'hidden', timeout: 30000 });
    }

    async isModalClosed() {
        console.log('Verifying modal is closed');
        const modal = this.page.locator(this.modalContainer);
        const isHidden = await modal.isHidden();
        console.log(`Modal hidden status: ${isHidden}`);
        return isHidden;
    }

    async isPageDisplayed() {
        await this.page.waitForLoadState('domcontentloaded');
        const url = this.page.url();
        console.log(`Checking page display. Current URL: ${url}`);
        return url.includes('/creative-space');
    }

    async isCreateImageModalDisplayed() {
        console.log('Verifying Create Image Modal is displayed');
        try {
            // Since we ensured the modal is open in the click step, we just do a quick verify of the strongest indicator
            const scrollContainer = this.page.locator('#creative-review-scroll-container');
            await scrollContainer.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (e) {
            console.error('Modal verification failed in verification step.');

            // Debug fallback
            const dialogs = await this.page.locator('[role="dialog"]').count();
            console.log(`Debug: Found ${dialogs} dialogs visible.`);

            return false;
        }
    }

    async isMarketingPageDisplayed() {
        await this.page.waitForLoadState('domcontentloaded');
        const url = this.page.url();
        return url.includes('/marketing');
    }

    async isDashboardPageDisplayed() {
        console.log('Waiting for dashboard redirection...');
        try {
            await this.page.waitForURL(url => url.includes('/dashboard') || url.endsWith('.io/') || url.includes('/feedbox'), { timeout: 30000 });
            const url = this.page.url();
            console.log(`Current URL after redirect: ${url}`);
            return true;
        } catch (error) {
            console.error(`Dashboard redirection failed: ${error.message}`);
            return false;
        }
    }
}

module.exports = { CreativeSpacePage };
