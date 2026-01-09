const { When, Then } = require('@cucumber/cucumber');
const { FeedboxPage } = require('../pages/FeedboxPage');
const { expect } = require('@playwright/test');

When('the user clicks on the Feedbox menu', async function () {
    this.feedboxPage = new FeedboxPage(this.page);
    await this.feedboxPage.navigateToFeedbox();
});

Then('the Feedbox page should be displayed', async function () {
    await this.feedboxPage.verifyFeedboxDisplayed();
});

When('the user clicks on the select reviews option', async function () {
    await this.feedboxPage.clickSelectReviews();
});

When('the user selects all reviews', async function () {
    await this.feedboxPage.clickSelectAllCheckbox();
});

When('the user clicks on the Favourite icon', async function () {
    await this.feedboxPage.clickFavouriteIcon();
});

Then('the user confirms adding to favorites', async function () {
    // Debug: check method exists
    if (typeof this.feedboxPage.confirmAddToFavorites !== 'function') {
        throw new Error('confirmAddToFavorites method not found on FeedboxPage');
    }

    await this.feedboxPage.confirmAddToFavorites();
});

When('the user clicks the check box of first review', async function () {
    await this.feedboxPage.clickFirstReviewCheckbox();
});

When('the user clicks on the Unfavourite icon', async function () {
    await this.feedboxPage.clickUnfavouriteIcon();
});

When('the user confirms the unfavourite action', async function () {
    await this.feedboxPage.confirmUnfavouriteAction();
});

Then('the confirmation popup {string} should be displayed', async function (title) {
    await this.feedboxPage.verifyPopupTitle(title);
});

When('the user clicks on Remove button', async function () {
    await this.feedboxPage.clickRemoveButton();
});

Then('the message {string} should be displayed', async function (message) {
    await this.feedboxPage.verifySuccessMessage(message);
});
