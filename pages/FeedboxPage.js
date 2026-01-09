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
        // Target the button directly, checking for visibility
        // ID should be unique, but if duplicates exist (e.g. mobile/desktop), filter by visible
        const btn = this.page.locator('#select-reviews-btn');

        try {
            await btn.first().waitFor({ state: 'attached', timeout: 5000 });

            const visibleBtn = btn.locator('visible=true');
            if (await visibleBtn.count() > 0) {
                await visibleBtn.first().click();
            } else {
                console.warn('"Select Reviews" button attached but not visible. Attempting force click on first instance.');
                await btn.first().click({ force: true });
            }
        } catch (e) {
            console.error('Error clicking Select Reviews:', e);
            // Last resort
            await btn.first().click({ force: true });
        }
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
        // The previous attempt found a hidden button. 
        // We will target the button with the specific data attribute found in the logs: data-review-label-trigger
        // and ensure we interact with the visible one.

        const icon = this.page.locator('button[data-review-label-trigger]').filter({ hasText: 'Label' });

        // Wait for at least one to be visible
        try {
            await icon.first().waitFor({ state: 'attached', timeout: 5000 });
            if (await icon.count() > 1) {
                // specific handling if multiple exist (desktop/mobile)
                await icon.locator('visible=true').first().click();
            } else {
                await icon.click();
            }
        } catch (e) {
            console.warn('Primary locator failed/timeout, trying fallback to forced click on first...', e.message);
            // Fallback: try clicking the first one even if perceived hidden or use the user's deep selector
            // User provided specific locator: 
            // #batch-operations-panel > div > div > div.flex.flex-wrap.items-center.gap-2.md\:gap-3 > div > div > button > span > span
            // We'll trust the data attribute first but force it.
            await this.page.locator('button[data-review-label-trigger]').first().click({ force: true });
        }
    }

    async selectLabel(labelName) {
        console.log(`Selecting label: ${labelName}`);

        // Scope to the batch operations panel to avoid strict mode violations from other cards
        const container = this.page.locator('#batch-operations-panel .label-popover-container');

        // 1. Search (Optional but good practice if list is long)
        const input = container.locator('input[placeholder*="Search"]');

        // Check availability safely using first() just in case, though scoping should help
        if (await input.count() > 0 && await input.first().isVisible()) {
            await input.first().fill(labelName);
            await this.page.waitForTimeout(500);
        }

        // 2. Select specific label using user provided strategy (now using the variable container)
        const labelItem = container.getByText(labelName, { exact: true });

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

    async clickApplyButton() {
        console.log('Clicking Apply button...');
        // Reuse the generic batch action button locator
        const applyBtn = this.page.locator('#batch-action-btn');
        await applyBtn.waitFor({ state: 'visible', timeout: 5000 });
        await applyBtn.click();

        // Wait for modal to disappear/toast/network idle?
        // Usually clicking Apply closes the modal.
        await this.page.waitForTimeout(1000); // Small stability wait
    }

    async verifyLabelAttached(labelName) {
        console.log(`Verifying label "${labelName}" is attached...`);
        // Use a robust list of potential containers/tags matching the selection logic + broader fallbacks
        // User specifically pointed out ".feed-label-chip"
        const labelPill = this.page.locator([
            `.feed-label-chip:has-text("${labelName}")`,
            `.feed-card-tags span:has-text("${labelName}")`,
            `.tags-container span:has-text("${labelName}")`,
            `span.badge:has-text("${labelName}")`,
            `div[class*="tag"]:has-text("${labelName}")`,
            `.review-card span:has-text("${labelName}")`
        ].join(', ')).first();

        await expect(labelPill).toBeVisible({ timeout: 10000 });
    }

    async verifyLabelRemoved(labelName) {
        console.log(`Verifying label "${labelName}" is removed...`);
        // Check that the label pill is either NOT visible or NOT attached
        const labelPill = this.page.locator([
            `.feed-label-chip:has-text("${labelName}")`,
            `.feed-card-tags span:has-text("${labelName}")`,
            `.tags-container span:has-text("${labelName}")`,
            `span.badge:has-text("${labelName}")`,
            `div[class*="tag"]:has-text("${labelName}")`,
            `.review-card span:has-text("${labelName}")`
        ].join(', ')).first();

        await expect(labelPill).toBeHidden({ timeout: 10000 });
    }

    async clickReviewWithoutLabel(labelToAvoid) {
        console.log(`Selecting a visible review that does NOT have label: "${labelToAvoid}"...`);

        // Locate all visible toggle buttons
        const toggleButtons = this.page.locator('button[data-feed-selection-toggle]').filter({ hasText: '' });

        const count = await toggleButtons.count();
        console.log(`Found ${count} toggle buttons.`);

        for (let i = 0; i < count; i++) {
            const btn = toggleButtons.nth(i);

            if (!(await btn.isVisible())) continue;

            // Get card container
            const card = btn.locator('xpath=./ancestor::div[contains(@class, "feed-card") or contains(@class, "review-card") or contains(@class, "border")]').first();

            // Check for SPECIFIC label
            const labelLocator = card.locator(`.feed-card-tags span:has-text("${labelToAvoid}"), .tags-container span:has-text("${labelToAvoid}"), span.badge:has-text("${labelToAvoid}")`);

            if (await labelLocator.count() === 0) {
                console.log(`Found review at index ${i} without label "${labelToAvoid}". Clicking...`);
                await btn.click();
                return;
            } else {
                console.log(`Review at index ${i} has label "${labelToAvoid}". Skipping.`);
            }
        }

        console.warn(`No visible review found WITHOUT label "${labelToAvoid}". Clicking the first visible one as fallback.`);
        if (count > 0) {
            await toggleButtons.first().click();
        } else {
            throw new Error("No reviews found.");
        }
    }

    async reloadPage() {
        console.log('Reloading page to ensure fresh state...');
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
        // Wait for Feedbox key element again
        await this.selectReviewsText.first().waitFor({ state: 'visible', timeout: 30000 });
    }

    async clickReviewWithLabel(labelToFind) {
        console.log(`Selecting a visible review that HAS label: "${labelToFind}"...`);

        const toggleButtons = this.page.locator('button[data-feed-selection-toggle]').filter({ hasText: '' });
        const count = await toggleButtons.count();
        console.log(`Found ${count} toggle buttons.`);

        for (let i = 0; i < count; i++) {
            const btn = toggleButtons.nth(i);
            if (!(await btn.isVisible())) continue;

            const card = btn.locator('xpath=./ancestor::div[contains(@class, "feed-card") or contains(@class, "review-card") or contains(@class, "border")]').first();

            // Check if this card HAS the label
            const labelLocator = card.locator([
                `.feed-label-chip:has-text("${labelToFind}")`,
                `.feed-card-tags span:has-text("${labelToFind}")`,
                `.tags-container span:has-text("${labelToFind}")`,
                `span.badge:has-text("${labelToFind}")`,
                `div[class*="tag"]:has-text("${labelToFind}")`,
                `.review-card span:has-text("${labelToFind}")`
            ].join(', '));

            if (await labelLocator.count() > 0) {
                console.log(`Found review at index ${i} WITH label "${labelToFind}". Clicking...`);
                await btn.click();
                return;
            }
        }

        console.warn(`No review found WITH label "${labelToFind}". Cannot proceed with strict selection.`);
        throw new Error(`No review found with label "${labelToFind}" to remove.`);
    }
}

module.exports = { FeedboxPage };
