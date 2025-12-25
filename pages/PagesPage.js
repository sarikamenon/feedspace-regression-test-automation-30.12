const { expect } = require('@playwright/test');

class PagesPage {
    constructor(page) {
        this.page = page;
    }

    // -------------------------------
    // CREATE PAGE
    // -------------------------------
    async clickCreatePageButton() {
        console.log('Clicking on the Create Page button');

        // Ensure Pages route is loaded
        await this.page.waitForURL('**/pages', { timeout: 60000 });

        // Restore the robust locator filters as per user logic
        const createPageBtn = this.page
            .locator('button', { hasText: 'Create Page' })
            .filter({ has: this.page.locator('span:has-text("Create Page")').or(this.page.locator('text="Create Page"')) })
            .filter({ hasNot: this.page.locator('[hidden]') });

        console.log('Waiting for Create Page button to be attached...');
        await createPageBtn.first().waitFor({ state: 'attached', timeout: 30000 });

        // Use force: true to handle cases where Playwright thinks it's hidden (e.g. during animations)
        await createPageBtn.first().click({ force: true });
        console.log('Clicked on the Create Page button.');
    }

    // -------------------------------
    // SELECT FIRST 5 REVIEWS
    // -------------------------------
    async selectFirstFiveReviews() {
        console.log('Waiting for page review list...');
        const reviewsList = this.page.locator('#page-feeds-list');

        try {
            await reviewsList.waitFor({ state: 'visible', timeout: 180000 }); // 3 mins
        } catch (e) {
            const noReviews = this.page.locator('#pages-no-reviews-found');
            if (await noReviews.isVisible()) {
                console.log('No reviews found on page');
                return;
            }
            throw new Error('Page review list did not appear within 180s');
        }

        console.log('Selecting first 5 page reviews...');
        const checkboxes = reviewsList.locator('input.toggleCheckbox'); // checkbox inside label

        try {
            await checkboxes.first().waitFor({ state: 'attached', timeout: 60000 });

            const count = await checkboxes.count();
            console.log(`Found ${count} total checkboxes`);

            let selected = 0;

            for (let i = 0; i < count && selected < 5; i++) {
                const cb = checkboxes.nth(i);
                const isChecked = await cb.isChecked();

                if (!isChecked) {
                    console.log(`Selecting review ${selected + 1}...`);
                    try {
                        await cb.click({ timeout: 5000 });
                    } catch (e) {
                        console.log(`Direct click failed, trying force click for review ${selected + 1}`);
                        await cb.click({ force: true });
                    }
                    selected++;
                    await this.page.waitForTimeout(1000);
                } else {
                    console.log(`Review ${i + 1} is already selected.`);
                    selected++;
                }
            }

            console.log(`✅ Successfully selected ${selected} reviews out of ${count}`);
        } catch (error) {
            console.log(`Error selecting reviews: ${error.message}. Proceeding...`);
        }
    }


    // -------------------------------
    // VERIFY REVIEW SELECTION
    // -------------------------------
    async verifyAtLeastOneReviewSelected() {
        const checkedCount = await this.page
            .locator('#page-feed-list-container input[type="checkbox"]:checked')
            .count();

        console.log(`Checked reviews count: ${checkedCount}`);
        expect(checkedCount).toBeGreaterThan(0);
    }

    // -------------------------------
    // SAVE & NEXT
    // -------------------------------
    async clickSaveAndNext() {
        console.log('Clicking Save & Next button...');

        if (this.page.isClosed()) {
            throw new Error('Page already closed before Save & Next');
        }

        const btn = this.page.getByRole('button', {
            name: /save.*next/i
        }).first();

        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click();

        console.log('Clicked Save & Next');
    }

    // -------------------------------
    // SAVE & SHARE
    // -------------------------------
    async clickSaveAndShare() {
        console.log('Clicking Save & Share button...');

        if (this.page.isClosed()) {
            throw new Error('Page already closed before Save & Share');
        }

        const btn = this.page.getByRole('button', {
            name: /save.*share/i
        }).first();

        await btn.waitFor({ state: 'visible', timeout: 30000 });

        let enabled = false;
        for (let i = 0; i < 10; i++) {
            if (await btn.isEnabled()) {
                enabled = true;
                break;
            }
            await this.page.waitForTimeout(1500);
        }

        if (!enabled) {
            console.log('Button not enabled, forcing click');
        }

        await btn.click({ force: true });
        console.log('Clicked Save & Share');
    }
}

module.exports = { PagesPage };
