const { expect } = require('@playwright/test');

class FormsPage {
    constructor(page) {
        this.page = page;

        // ---------------------
        // Locators
        // ---------------------
        this.formsMenuLink = page.getByRole('link', { name: /Forms/i });
        this.createFormBtn = page.locator('button:has-text("Create"), button:has-text("New Form")');
        this.formPromptField = page.locator('textarea#description');
        this.generateFormBtn = page.locator('button:has-text("Generate Form")');
        this.allowTextReviewCheckbox = page.locator('input[name="allow_text_review"]');
        this.allowRatingsCheckbox = page.locator('input[name="allow_review_type"]');
        this.saveAndNextBtn = page.locator('button').filter({ has: page.locator('span:has-text("Save & Next")') }).filter({ visible: true });
        this.saveAndShareBtn = page.locator('button:has-text("Save & Share")');
        this.formPreviewBtn = page.locator('#share-form-magic-link-input-wizard');
        this.writeFeedbackBtn = page.locator('#preview-write-text');
        this.feedbackTextField = page.locator('#text-review-comment');
        this.submitFeedbackBtn = page.locator('#submit-text-review, .feedspace-button-inner:has-text("Submit Testimonial"), span:has-text("Submit Testimonial"), button:has-text("Submit Testimonial")');
        this.finalSubmitBtn = page.locator('#submit-btn');
        this.successMessage = page.locator('text="Thank You"').or(page.locator('.feedspace-thankyou-screen-info-box'));
        this.closeBtn = page.locator('#feed-form-close-btn, button[id="feed-form-close-btn"]');
        this.shareMagicLinkInput = page.locator('#share-form-magic-link-input-wizard');
    }

    // ---------------------
    // Navigation
    // ---------------------
    async navigateToForms() {
        console.log('Navigating to Forms page...');
        await this.formsMenuLink.waitFor({ state: 'visible', timeout: 30000 });
        await this.formsMenuLink.click();
    }

    async clickCreateOrNewForm() {
        console.log('Clicking Create/New Form button...');
        await this.createFormBtn.first().waitFor({ state: 'visible', timeout: 30000 });
        await this.createFormBtn.first().click();
    }

    async enterFormPrompt(prompt) {
        console.log(`Entering form prompt: ${prompt}`);
        await this.formPromptField.waitFor({ state: 'visible', timeout: 10000 });
        await this.formPromptField.click({ force: true });
        await this.formPromptField.fill(prompt);
    }

    async clickGenerateForm() {
        console.log('Clicking Generate Form...');
        await this.generateFormBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.generateFormBtn.click();
    }

    async verifyFormCreated() {
        console.log('Verifying form creation...');
        // Wait for the URL to indicate we have moved to the edit/capture page
        // or wait for the "Generate Form" button to be NOT visible
        // However, checking for the redirection target element is best.

        // Wait for a key element of the next page to be visible
        try {
            await this.page.locator('#landing-page-tab-cont').waitFor({ state: 'visible', timeout: 30000 });
            console.log('Form created and redirected to capture page successfully.');
        } catch (e) {
            console.warn('Timed out waiting for #landing-page-tab-cont. Checking if we are still on the generation page...');
            if (await this.generateFormBtn.isVisible()) {
                throw new Error('Form generation failed or stuck on generation page.');
            }
            throw e;
        }
    }

    async checkAllowTextReview(check) {
        console.log(`${check ? 'Checking' : 'Unchecking'} Allow Text Review...`);
        // Ensure element is visible before checking state
        await this.allowTextReviewCheckbox.waitFor({ state: 'attached' });
        const isChecked = await this.allowTextReviewCheckbox.isChecked();
        if (check && !isChecked) {
            await this.allowTextReviewCheckbox.check({ force: true });
        }
        if (!check && isChecked) {
            await this.allowTextReviewCheckbox.uncheck({ force: true });
        }
    }

    // ---------------------
    // Allow Ratings
    // ---------------------
    async checkAllowRatings(check) {
        console.log(`${check ? 'Checking' : 'Unchecking'} Allow Ratings...`);
        await this.allowRatingsCheckbox.waitFor({ state: 'attached' });
        const isChecked = await this.allowRatingsCheckbox.isChecked();
        if (check && !isChecked) await this.allowRatingsCheckbox.check({ force: true });
        if (!check && isChecked) await this.allowRatingsCheckbox.uncheck({ force: true });
    }

    // ---------------------
    // Save & Navigate Tabs
    // ---------------------
    async clickSaveAndNext() {
        console.log('Clicking Save and Next...');
        await this.saveAndNextBtn.waitFor({ state: 'visible', timeout: 15000 });
        // Sometimes the button might be covered or animating
        await this.saveAndNextBtn.scrollIntoViewIfNeeded();
        await this.saveAndNextBtn.click({ force: true });
        await this.page.waitForTimeout(1000); // animation buffer
    }

    async clickSaveAndVerifyTab(tabBtnSelector, tabContentSelector) {
        console.log(`Navigating to tab/content: ${tabContentSelector}`);
        const tabBtn = this.page.locator(tabBtnSelector);
        const tabContent = this.page.locator(tabContentSelector);

        // Ensure tab button is visible before clicking
        await tabBtn.waitFor({ state: 'visible', timeout: 30000 });
        await tabBtn.click({ force: true });
        // Wait for the content to correspond to the tab
        await tabContent.waitFor({ state: 'visible', timeout: 30000 });
        await expect(tabContent).toBeVisible();
    }

    async clickSaveAndShare() {
        console.log('Clicking Save and Share...');
        await this.saveAndShareBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveAndShareBtn.click({ force: true });
    }

    // ---------------------
    // Form Preview & Feedback
    // ---------------------

    async clickShareMagicLink() {
        console.log('Clicking Share Form Magic Link (opens new tab)...');
        await this.shareMagicLinkInput.waitFor({ state: 'visible', timeout: 10000 });
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.shareMagicLinkInput.click()
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

    async submitFeedback(feedback) {
        console.log(`Submitting feedback: ${feedback}`);

        // Wait for "Write Your Feedback" button
        await this.writeFeedbackBtn.waitFor({ state: 'visible', timeout: 20000 });

        let isFeedbackFieldVisible = await this.feedbackTextField.isVisible();

        if (!isFeedbackFieldVisible) {
            console.log('Clicking Write Your Feedback button...');
            await this.writeFeedbackBtn.click({ force: true });

            // Wait for the feedback field to appear (modal animation)
            try {
                await this.feedbackTextField.waitFor({ state: 'visible', timeout: 5000 });
            } catch (e) {
                console.warn('Feedback field not visible after first click. Retrying click...');
                await this.writeFeedbackBtn.click({ force: true });
                await this.feedbackTextField.waitFor({ state: 'visible', timeout: 10000 });
            }
        }

        await this.feedbackTextField.fill(feedback);

        await this.submitFeedbackBtn.waitFor({ state: 'visible', timeout: 5000 });
        await this.submitFeedbackBtn.click({ force: true });

        try {
            // Optional final submit button
            await this.finalSubmitBtn.waitFor({ state: 'visible', timeout: 5000 });
            await this.finalSubmitBtn.click({ force: true });
        } catch (e) {
            console.log('Final submit button not required or not found.');
        }
    }

    async verifySuccessMessage(message) {
        console.log(`Verifying success message: ${message}`);
        await expect(this.page.locator(`text="${message}"`)).toBeVisible({ timeout: 10000 });
    }

    async clickClose() {
        console.log('Clicking close...');
        await this.closeBtn.first().click();
    }
}

module.exports = { FormsPage };
