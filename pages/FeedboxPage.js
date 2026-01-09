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
        // Re-use the confirm logic. 
        // If the button text is different (e.g. "Remove"), we might need to adjust confirmAddToFavorites or create a new internal helper.
        // Assuming for now it uses the same structure. 
        // If "Remove" button has a different ID, we should handle that. 
        // User snippet didn't give Remove button ID, but usually it's consistent.
        // Let's assume it works like Add but verify title.

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

}

module.exports = { FeedboxPage };
