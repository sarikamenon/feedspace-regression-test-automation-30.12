const { expect } = require('@playwright/test');

class FeedboxPage {
    constructor(page) {
        this.page = page;

        // -------------------
        // Locators
        // -------------------
        this.feedboxMenuLink = page.locator('a[href="/feedbox"]');
        this.selectReviewsText = page.locator('#select-reviews-btn > svg');
        this.selectAllCheckbox = page.locator('#select-all');
        this.favouriteIcon = page.locator('#batch-operations-panel button.mark-favorite-btn');
        this.confirmationPopup = page.locator('#batch-action-title');
        this.addButton = page.locator('#batch-action-btn'); // Correct locator for Add button

        // Unfavourite Icon
        this.unfavouriteIcon = page.locator('#batch-operations-panel button.mark-unfavorite-btn, button.mark-unfavorite-btn');

        // First Review Checkbox
        this.firstReviewCheckbox = page.locator('.checkbox button[data-feed-selection-toggle]').first();
    }

    // -------------------
    // Actions
    // -------------------

    async navigateToFeedbox() {
        console.log('Navigating to Feedbox page...');
        await this.feedboxMenuLink.waitFor({ state: 'visible', timeout: 30000 });
        await this.feedboxMenuLink.click();
    }

    async verifyFeedboxDisplayed() {
        console.log('Verifying Feedbox page displayed...');
        await expect(this.page).toHaveURL(/.*\/feedbox/);
    }

    async clickSelectReviews() {
        console.log('Clicking "Select Reviews"...');
        await this.selectReviewsText.first().waitFor({ state: 'visible', timeout: 10000 });
        await this.selectReviewsText.first().click();
    }

    async clickSelectAllCheckbox() {
        console.log('Clicking "Select All" checkbox...');
        await this.selectAllCheckbox.first().waitFor({ state: 'visible', timeout: 10000 });
        await this.selectAllCheckbox.first().click();
    }

    async clickFavouriteIcon() {
        console.log('Clicking Favourite icon...');
        await this.favouriteIcon.waitFor({ state: 'visible', timeout: 5000 });
        await this.favouriteIcon.click();
    }

    async confirmAddToFavorites(expectedTitle = "Add to favorites") {
        console.log('Waiting for Add to favorites popup...');
        try {
            const titleLocator = this.page.locator('#batch-action-title');
            await titleLocator.waitFor({ state: 'visible', timeout: 20000 });
            console.log('Popup title visible.');

            await expect(titleLocator).toContainText(new RegExp(expectedTitle, 'i'), { timeout: 10000 });
            console.log('Title verified.');

            const addButton = this.page.locator('#batch-action-btn');
            await addButton.waitFor({ state: 'visible', timeout: 10000 });
            console.log('Add button visible.');
            await addButton.scrollIntoViewIfNeeded();
            await addButton.click({ force: true });
            console.log('Clicked Add button.');

            // DO NOT wait for toast here! Toast will be handled in verifySuccessMessage
        } catch (e) {
            console.error('Error in confirmAddToFavorites:', e);
            throw e;
        }
    }


    async clickFirstReviewCheckbox() {
        console.log('Clicking check box of first review...');
        await this.firstReviewCheckbox.waitFor({ state: 'visible', timeout: 10000 });
        await this.firstReviewCheckbox.click();
    }

    async clickUnfavouriteIcon() {
        console.log('Clicking Unfavourite icon...');
        await this.unfavouriteIcon.waitFor({ state: 'visible', timeout: 5000 });
        await this.unfavouriteIcon.click();
    }

    async confirmUnfavouriteAction(expectedTitle = "Remove from favorites") {
        console.log(`Waiting for "${expectedTitle}" popup...`);
        // Re-use the confirm logic but with the Remove button if it's different, 
        // or if it uses the same "batch-action-btn" but text is "Remove".
        // The user snippet for confirmation didn't specify the button ID, but usually it's the same or similar.
        // Assuming it's the same batch action button for now or we check text "Remove".
        await this.confirmAddToFavorites(expectedTitle);
    }

    async verifyPopupTitle(expectedTitle) {
        console.log(`Verifying popup title: "${expectedTitle}"...`);
        const titleLocator = this.page.locator('#batch-action-title');
        await titleLocator.waitFor({ state: 'visible', timeout: 20000 });
        await expect(titleLocator).toContainText(new RegExp(expectedTitle, 'i'), { timeout: 10000 });
    }

    async clickRemoveButton() {
        console.log('Clicking Remove button...');
        // User provided logic: id="batch-action-btn"
        const removeButton = this.page.locator('#batch-action-btn');
        await removeButton.waitFor({ state: 'visible', timeout: 10000 });
        await removeButton.click({ force: true });
    }

    async verifySuccessMessage(msg) {
        console.log(`Verifying success message: "${msg}"`);

        // Use getByText exact match to catch ephemeral toast
        const toast = this.page.getByText(msg, { exact: true });
        await expect(toast).toBeVisible({ timeout: 5000 }); // 5s is enough for short-lived toast

        console.log('Success message verified.');
    }

    // -------------------
    // Label Logic
    // -------------------

    async clickLabelIcon() {
        console.log('Clicking Label icon...');
        // User provided specific locator: 
        // #batch-operations-panel > div > div > div.flex.flex-wrap.items-center.gap-2.md\:gap-3 > div > div > button > span > span
        // We will try to use a slightly more robust version of it, targeting the button in the batch panel
        const icon = this.page.locator('#batch-operations-panel button').filter({ hasText: 'Label' }).first().or(
            this.page.locator('#batch-operations-panel svg.lucide-tag').locator('..')
        ).or(
            this.page.locator('button:has-text("Label")')
        );

        await icon.first().waitFor({ state: 'visible', timeout: 10000 });
        await icon.first().click();
    }

    async selectLabel(labelName) {
        console.log(`Selecting label: ${labelName}`);

        // 1. Search (Optional but good practice if list is long)
        // Trying generic search input just in case
        const input = this.page.locator('.label-popover-container input[placeholder*="Search"]');
        if (await input.count() > 0 && await input.isVisible()) {
            await input.fill(labelName);
            await this.page.waitForTimeout(500);
        }

        // 2. Select specific label using user provided strategy
        // label dropdown await page.locator('#batch-operations-panel .label-popover-container').getByText('automation', { exact: true }).click();

        const labelItem = this.page.locator('#batch-operations-panel .label-popover-container')
            .getByText(labelName, { exact: true });

        await labelItem.waitFor({ state: 'visible', timeout: 5000 });
        await labelItem.click();
    }

    async clickCloseLabelModal() {
        console.log('Clicking Close Label Modal button...');
        // User provided: #close-action > svg
        const closeBtn = this.page.locator('#close-action');
        await closeBtn.waitFor({ state: 'visible', timeout: 5000 });
        await closeBtn.click();
    }

    async verifyLabelAttached(labelName) {
        console.log(`Verifying label "${labelName}" is attached...`);
        // Check for the label pill on the first review card (or selected reviews)
        const labelPill = this.page.locator(`.feed-card-tags span:has-text("${labelName}"), .review-card span:has-text("${labelName}")`).first();
        await expect(labelPill).toBeVisible({ timeout: 10000 });
    }

    async clickFirstUnlabeledReviewCheckbox() {
        console.log('Selecting first visible unlabeled review...');

        // 1. Find all potential review cards/containers
        // Assuming a common container class or structure; using a broad match first then filtering
        // "Find only visible review cards"

        // Strategy: 
        // a. Find the toggle button which is visible
        // b. Go up to its container (card)
        // c. Check if that card has any label

        // Locate all visible toggle buttons (not the hidden inputs)
        const toggleButtons = this.page.locator('button[data-feed-selection-toggle]').filter({ hasText: '' }); // ensure it's the button

        const count = await toggleButtons.count();
        console.log(`Found ${count} toggle buttons.`);

        for (let i = 0; i < count; i++) {
            const btn = toggleButtons.nth(i);

            // Check visibility
            if (!(await btn.isVisible())) continue;

            // Get the card container (closest logic depends on DOM, assuming parent or grandparent)
            // User hint: "Find reviews without any label"
            // We can check if the card containing this button has a label

            // Go up to the card element. Adjust selector as needed. 
            // Often it's a div with a class or the row.
            // Let's assume the button is inside the card.
            // We will look for a parent that MIGHT contain tags.
            const card = btn.locator('xpath=./ancestor::div[contains(@class, "feed-card") or contains(@class, "review-card") or contains(@class, "border")]').first();

            // Check if this card has labels
            // User provided locator for label verification: .feed-card-tags span, .review-card span
            const hasLabels = await card.locator('.feed-card-tags span, .tags-container span, span.badge').count() > 0;

            if (!hasLabels) {
                console.log(`Found unlabeled visible review at index ${i}. Clicking...`);
                await btn.click();
                return;
            }
        }

        console.warn('No visible unlabeled reviews found. Attempting to click the first visible toggle as fallback.');
        await toggleButtons.first().click();
    }
}

module.exports = { FeedboxPage };
