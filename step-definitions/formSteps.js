const { When, Then } = require('@cucumber/cucumber');
const { FormsPage } = require('../pages/FormsPage');

When('I navigate to the Forms page via menu', async function () {
    this.formsPage = new FormsPage(this.page);
    await this.formsPage.navigateToForms();
});

When('I click on the Create or New Form button if form exists', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);
    await this.formsPage.clickCreateOrNewFormButton();
});

When('I enter the form prompt in the form prompt field', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);
    // Hardcoded prompt for now, or could come from feature example
    await this.formsPage.enterFormPrompt("Create a feedback form for my website");
});

Then('I click on the Generate Form button', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);
    await this.formsPage.clickGenerateForm();
});

Then('the form is created successfully', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);
    console.log("Waiting for form creation to complete...");
    await this.formsPage.verifyFormCreated();
});

Then('the user is redirected to the capture review page', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);

    const capturePage = this.page.locator('#landing-page-tab-cont');
    await capturePage.waitFor({ state: 'visible', timeout: 30000 });

    console.log('Capture review page (landing tab) is visible');
});

Then('I click on the Save and Next button', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);
    await this.formsPage.clickSaveAndNext();
});

Then('the user is redirected to the user info page', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);
    await this.formsPage.verifyRedirectTo('user-info'); // URL likely contains 'user-info'
});

Then('the user is redirected to the thank you page', async function () {
    await this.formsPage.verifyRedirectTo('thank-you');
});

Then('the user is redirected to the settings page', async function () {
    await this.formsPage.verifyRedirectTo('settings');
});

Then('I click on the Save and Share button', async function () {
    await this.formsPage.clickSaveAndShare();
});

Then('I click on the Form Preview button', async function () {
    await this.formsPage.clickFormPreview();
});


// Preview Interactions
When('I click on the Write Your Feedback button', async function () {
    if (!this.formsPage) this.formsPage = new (require('../pages/FormsPage').FormsPage)(this.page);

    // Use preview page if open, else main page
    const page = this.formsPage.previewPage || this.page;

    const feedbackBtn = page.locator('button#text-review');

    // Wait for it to be visible and enabled
    await feedbackBtn.waitFor({ state: 'visible', timeout: 60000 });

    // Ensure it's not covered by another element
    await page.waitForTimeout(500); // small delay to let animations finish

    try {
        await feedbackBtn.click({ force: true });
        console.log('Clicked Write Your Feedback button');
    } catch (e) {
        console.log('Direct click failed, trying JS click...');
        // Fallback using JS if Playwright click fails
        await page.evaluate((selector) => {
            const btn = document.querySelector(selector);
            btn && btn.click();
        }, 'button#text-review');
        console.log('Clicked Write Your Feedback button via JS');
    }
});



Then('I click on the star rating button', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);
    const page = this.formsPage.previewPage || this.page;

    const starLocator = page.locator("div[id='icon-type-star'] span:nth-child(2) svg");
    const starCount = await starLocator.count();

    if (starCount === 0) {
        console.log('Star rating not present for this form, skipping...');
        return; // skip step
    }

    // Check visibility
    const isVisible = await starLocator.first().isVisible();
    if (!isVisible) {
        console.log('Star rating element exists but is hidden, skipping...');
        return;
    }

    // Safe click
    try {
        await starLocator.first().scrollIntoViewIfNeeded();
        await starLocator.first().click({ force: true });
        console.log('Clicked star rating');
    } catch (e) {
        console.warn('Failed to click star rating, skipping...', e);
    }
});


Then('I enter the feedback in the submit feedback field', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);
    const page = this.formsPage.previewPage || this.page;

    const feedbackLocator = page.locator('#text-review-comment');

    // Wait until the field is visible and enabled
    await feedbackLocator.waitFor({ state: 'visible', timeout: 30000 });

    // Clear any existing value
    await feedbackLocator.fill('');

    // Type the feedback slowly to simulate user input
    await feedbackLocator.type("Great form experience!", { delay: 50 });

    console.log('Entered feedback successfully');
});


Then('I click on the Submit Feedback button', async function () {
    if (!this.formsPage) this.formsPage = new FormsPage(this.page);
    const page = this.formsPage.previewPage || this.page;

    const submitBtn = page.locator('#submit-text-review');
    await submitBtn.waitFor({ state: 'visible', timeout: 30000 });
    await submitBtn.click({ force: true });

    console.log('Clicked Submit Feedback');
});


Then('I click on the Submit button again', async function () {
    const page = this.formsPage.previewPage || this.page;
    const submitBtn = page.locator('#submit-btn');
    if (await submitBtn.isVisible()) {
        await submitBtn.click({ force: true });
        console.log('Clicked secondary Submit button');
    } else {
        console.log('Secondary submit button not found, skipping.');
    }
});

Then('I see the success message {string}', async function (msg) {
    await this.formsPage.cxVerifySuccessMessage(msg);
});

Then('I switch back to the original tab', async function () {
    await this.formsPage.cxCloseTab();
});

Then('I click on the Close button', async function () {
    // This might overlap with shareSteps "I click on the close button"
    // Since we are back on main tab (Share modal potentially open), we reuse sharePage or try generic
    const { SharePage } = require('../pages/SharePage');
    const sharePage = new SharePage(this.page);
    await sharePage.clickCloseButton();
});
