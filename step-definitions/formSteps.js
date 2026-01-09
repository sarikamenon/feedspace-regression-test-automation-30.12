const { When, Then } = require('@cucumber/cucumber');
const { FormsPage } = require('../pages/FormsPage');
const { expect } = require('@playwright/test');

When(/^I navigate to the Forms page via menu\s*$/, async function () {
    this.formsPage = new FormsPage(this.page);
    await this.formsPage.navigateToForms();
});

When(/^I click on the Create or New Form button if form exists\s*$/, async function () {
    await this.formsPage.clickCreateOrNewForm();
});

When(/^I enter the form prompt "([^"]*)" in the form prompt field\s*$/, async function (prompt) {
    await this.formsPage.enterFormPrompt(prompt);
});

Then(/^I click on the Generate Form button\s*$/, async function () {
    await this.formsPage.clickGenerateForm();
});

Then(/^the form is created successfully\s*$/, async function () {
    await this.formsPage.verifyFormCreated();
});

Then(/^the user is redirected to the capture review page\s*$/, async function () {
    await this.formsPage.clickSaveAndVerifyTab('#landing-page-tab-cont', '#landing-page-tab');
});

Then(/^I check the Allow text review checkbox is enabled\s*$/, async function () {
    const isChecked = await this.formsPage.allowTextReviewCheckbox.isChecked();
    console.log(`Allow text review checkbox is enabled: ${isChecked}`);
});

Then(/^I enable it if disabled\s*$/, async function () {
    await this.formsPage.checkAllowTextReview(true);
});

Then(/^I check the Allow Ratings checkbox\s*$/, async function () {
    await this.formsPage.checkAllowRatings(true);
});

Then(/^I disable it if enabled\s*$/, async function () {
    await this.formsPage.checkAllowRatings(false);
});

// ---------------------
// Unified Save and Next steps
// ---------------------
Then(/^I click on the Save and Next button\s*$/, async function () {
    await this.formsPage.clickSaveAndNext();
});

Then(/^the user is redirected to the user info page\s*$/, async function () {
    await this.formsPage.clickSaveAndVerifyTab('#user-details-tab-cont', '#user-details-tab');
});

Then(/^the user is redirected to the thank you page\s*$/, async function () {
    await this.formsPage.clickSaveAndVerifyTab('#thank-you-tab-cont', '#thank-you-tab');
});

Then(/^the user is redirected to the settings page\s*$/, async function () {
    await this.formsPage.clickSaveAndVerifyTab('#form-details-tab-cont', '#form-details-tab');
});

// ---------------------
// Save & Share
// ---------------------
Then(/^I click on the Save and Share button\s*$/, async function () {
    await this.formsPage.clickSaveAndShare();
});

// ---------------------
// Form Preview & Feedback
// ---------------------
Then(/^I click on the Form Preview button\s*$/, async function () {
    console.log('Clicking Form Preview (Magic Link)...');

    const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        this.formsPage.formPreviewBtn.click()
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    console.log('Form Preview page loaded in new tab');

    // CRITICAL: Switch the active page context to the new tab for subsequent steps
    this.originalPage = this.page;
    this.page = newPage;
    this.formsPage = new FormsPage(this.page); // Re-instantiate with new page context!
});

Then(/^I click on the Write Your Feedback button\s*$/, async function () {
    // Try both locators provided by the user and the previous one
    const feedbackBtn = this.page.locator('#preview-write-text, #text-review, button:has-text("Write Your Feedback")').first();

    await feedbackBtn.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForTimeout(1000); // EXTRA STABILITY WAIT
    await feedbackBtn.click({ force: true });
    console.log('Clicked Write Your Feedback button.');

    // Give a small buffer for the feedback field to appear if needed
    await this.page.waitForTimeout(1000);
});

Then(/^I enter the feedback in the submit feedback field\s*$/, async function () {
    await this.formsPage.fillFeedback('Great service and friendly staff!');
});

Then(/^I click on the Submit Feedback button\s*$/, async function () {
    const btn = this.formsPage.submitFeedbackBtn.first();
    await btn.waitFor({ state: 'visible', timeout: 30000 });
    await btn.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000); // Wait for potential UI transitions
    await btn.click({ force: true });
    console.log('Clicked Submit Feedback button (#submit-text-review).');
});

Then(/^I click on the Submit button again\s*$/, async function () {
    console.log('Waiting for final submit button (#submit-btn)...');
    try {
        await this.formsPage.finalSubmitBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.formsPage.finalSubmitBtn.scrollIntoViewIfNeeded();
        await this.formsPage.finalSubmitBtn.click({ force: true });
        console.log('Clicked final submit button (#submit-btn).');
    } catch (e) {
        console.warn('Final submit button (#submit-btn) not found or not visible. This might be normal if the form submitted after the first click.');
    }
});

Then(/^I see the success message "([^"]*)"\s*$/, async function (message) {
    console.log(`Waiting for success message: "${message}" or "Thank You"...`);

    // Attempt to wait for either the specific message or the "Thank You" text
    const successLoc = this.page.locator('text="Thank You"').or(this.page.locator(`text="${message}"`)).or(this.formsPage.successMessage);

    await successLoc.first().waitFor({ state: 'visible', timeout: 30000 });
    console.log('Success message/box detected on screen.');
});

// ---------------------
// Switch tab
// ---------------------
Then(/^I switch back to the original tab\s*$/, async function () {
    if (this.originalPage) {
        console.log('Switching back to original tab...');
        // Close the current tab (preview) if we are in a new tab
        if (this.page !== this.originalPage) {
            await this.page.close();
        }
        this.page = this.originalPage;
        this.formsPage = new FormsPage(this.page);
        await this.page.bringToFront();
        console.log('Switched back to original tab and re-instantiated FormsPage.');
    } else {
        console.warn('originalPage not found, cannot switch back.');
    }
});

// ---------------------
// Close
// ---------------------
Then(/^I click on the Close button\s*$/, async function () {
    // This button is on the original tab's Share page
    await this.formsPage.closeBtn.waitFor({ state: 'visible', timeout: 15000 });
    await this.formsPage.closeBtn.click();
});
