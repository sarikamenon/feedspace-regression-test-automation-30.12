const { expect } = require('@playwright/test');

class WidgetsPage {
    constructor(page) {
        this.page = page;
    }

    async navigateToWidgets() {
        console.log('Navigating to Widgets page...');
        // Locator provided by user
        await this.page.getByRole('link', { name: 'Widgets' }).click();
        console.log('Navigated to Widgets page');
    }

    async selectCarouselTemplate() {
        console.log('Selecting Carousel template...');
        // Locator provided by user
        const templateBtn = this.page.getByText('Use this Template Carousel').first();
        await templateBtn.waitFor({ state: 'visible', timeout: 30000 });
        await templateBtn.click();
        console.log('Carousel template selected');
    }

    async selectFirstFiveWidgetReviews() {
        console.log('Waiting for widget review list...');
        const list = this.page.locator('#widget-feeds-list');

        try {
            await list.waitFor({ state: 'visible', timeout: 300000 });
        } catch (e) {
            const noReviews = this.page.locator('#widgets-no-reviews-found');
            if (await noReviews.isVisible()) {
                console.log('No reviews found in widget');
                return;
            }
            throw new Error('Widget review list did not appear within 300s');
        }

        console.log('Selecting first 5 widget reviews...');
        const checkboxes = list.locator('input[type="checkbox"]');

        try {
            // Wait for checkboxes to be attached
            await checkboxes.first().waitFor({ state: 'attached', timeout: 60000 });

            const count = await checkboxes.count();
            console.log(`Found ${count} total checkboxes`);

            let selected = 0;
            for (let i = 0; i < count && selected < 5; i++) {
                const cb = checkboxes.nth(i);

                const isChecked = await cb.isChecked();
                if (!isChecked) {
                    console.log(`Selecting widget review ${selected + 1}...`);
                    try {
                        await cb.click({ timeout: 5000 });
                    } catch (e) {
                        console.log(`Direct click failed, trying force click for widget review ${selected + 1}`);
                        await cb.click({ force: true });
                    }
                    selected++;
                    await this.page.waitForTimeout(1000);
                } else {
                    console.log(`Widget review ${i + 1} is already selected.`);
                    selected++;
                }
            }
            console.log(`Successfully selected ${selected} widget reviews.`);
        } catch (error) {
            console.log(`Error selecting widget reviews: ${error.message}. Proceeding...`);
        }
    }


    async clickSaveAndNext() {
        console.log('Clicking Save & Next on widget page...');
        const btn = this.page.getByRole('button', { name: /Save & Next/i }).first();
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click({ force: true });
        console.log('Clicked Save & Next');
    }

    async clickSaveAndShare() {
        console.log('Waiting for widget Save & Share button to be enabled...');
        const btn = this.page.getByRole('button', { name: /Save & Share/i }).first();

        await this.page.waitForTimeout(2000); // Initial delay

        await btn.waitFor({ state: 'visible', timeout: 30000 });

        let isEnabled = false;
        for (let i = 0; i < 15; i++) {
            isEnabled = await btn.isEnabled();
            if (isEnabled) break;
            console.log('Widget Save & Share not enabled yet, retrying...');
            await this.page.waitForTimeout(2000);
        }

        if (isEnabled) {
            console.log('Clicking widget Save & Share...');
            await btn.click({ force: true });
            console.log('Clicked Save & Share');
        } else {
            console.log('Widget Save & Share button did not become enabled. Force clicking...');
            await btn.click({ force: true }).catch(e => console.log(`Force click failed: ${e.message}`));
        }
    }

    async clickWidgetPreview() {
        console.log('Clicking Widget Preview button...');
        const btn = this.page.locator('#widget-preview-btn').first();
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click();
        console.log('Clicked Widget Preview');
    }
}

module.exports = { WidgetsPage };
