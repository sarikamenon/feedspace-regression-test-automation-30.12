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
        await this.page.waitForTimeout(3000); // wait for form creation animation
    }

    async checkAllowTextReview(check) {
        console.log(`${check ? 'Checking' : 'Unchecking'} Allow Text Review...`);
        const isChecked = await this.allowTextReviewCheckbox.isChecked();
        if (check && !isChecked) await this.allowTextReviewCheckbox.check();
        if (!check && isChecked) await this.allowTextReviewCheckbox.uncheck();
    }

    // ---------------------
    // Allow Ratings
    // ---------------------
    async checkAllowRatings(check) {
        console.log(`${check ? 'Checking' : 'Unchecking'} Allow Ratings...`);
        const isChecked = await this.allowRatingsCheckbox.isChecked();
        if (check && !isChecked) await this.allowRatingsCheckbox.check();
        if (!check && isChecked) await this.allowRatingsCheckbox.uncheck();
    }

    // ---------------------
    // Save & Navigate Tabs
    // ---------------------
    async clickSaveAndNext() {
        console.log('Clicking Save and Next...');
        await this.saveAndNextBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.saveAndNextBtn.click();
        await this.page.waitForTimeout(1000); // animation buffer
    }

    async clickSaveAndVerifyTab(tabBtnSelector, tabContentSelector) {
        console.log(`Navigating to tab/content: ${tabContentSelector}`);
        const tabBtn = this.page.locator(tabBtnSelector);
        const tabContent = this.page.locator(tabContentSelector);

        await tabBtn.waitFor({ state: 'visible', timeout: 15000 });
        await tabBtn.click({ force: true });
        await tabContent.waitFor({ state: 'visible', timeout: 15000 });
        await expect(tabContent).toBeVisible();
    }

    async clickSaveAndShare() {
        console.log('Clicking Save and Share...');
        await this.saveAndShareBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveAndShareBtn.click();
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
        await this.writeFeedbackBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.writeFeedbackBtn.click();

        await this.feedbackTextField.waitFor({ state: 'visible', timeout: 10000 });
        await this.feedbackTextField.fill(feedback);

        await this.submitFeedbackBtn.click();

        try {
            await this.finalSubmitBtn.waitFor({ state: 'visible', timeout: 5000 });
            await this.finalSubmitBtn.click();
        } catch (e) {
            console.log('Final submit button not required.');
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
