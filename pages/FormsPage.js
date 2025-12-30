const { expect } = require('@playwright/test');

class FormsPage {
    constructor(page) {
        this.page = page;
        // Locators
        this.formsMenuLink = 'a[href="/forms"]'; // Adjust selector based on actual menu
        this.createFormBtn = 'button:has-text("Create Form")'; // Selector for initial state
        this.newFormBtn = 'button:has-text("New Form")'; // Selector for subsequent state

        // This regex handles both "Create Form" and "New Form" roughly, but specific locators are safer
        this.anyCreateBtn = 'button:has-text("Create Form"), button:has-text("New Form")';

        this.promptInput = 'textarea[placeholder*="Describe the type of form"]'; // Adjust selector
        this.generateBtn = 'button:has-text("Generate Form")';
    }

    async navigateToForms() {
        console.log('Navigating to Forms page...');
        // Assuming there's a side menu or link
        await this.page.click('text=Forms');
        await this.page.waitForURL('**/forms', { timeout: 30000 });
    }

    async clickCreateOrNewFormButton() {
        console.log('Attempting to click Create or New Form button...');

        // Wait for list to load or empty state
        await this.page.waitForTimeout(2000); // stable wait for UI

        const createBtn = this.page.locator(this.createFormBtn);
        const newBtn = this.page.locator(this.newFormBtn);

        if (await newBtn.isVisible()) {
            console.log('Found "New Form" button. Clicking...');
            await newBtn.click();
        } else if (await createBtn.isVisible()) {
            console.log('Found "Create Form" button. Clicking...');
            await createBtn.click();
        } else {
            // Fallback: search for any button ensuring it's the right primary action
            console.log('Neither explicit button visible, searching for generic create action...');
            const anyBtn = this.page.locator(this.anyCreateBtn).first();
            if (await anyBtn.isVisible()) {
                await anyBtn.click();
            } else {
                throw new Error('Could not find "Create Form" or "New Form" button');
            }
        }
    }

    async enterFormPrompt(promptText) {
        console.log(`Entering form prompt: ${promptText}`);
        const input = this.page.locator(this.promptInput).first();
        // Fallback if specific locator fails, try generic textarea
        if (!await input.isVisible()) {
            await this.page.fill('textarea', promptText);
        } else {
            await input.fill(promptText);
        }
    }

    async clickGenerateForm() {
        console.log('Clicking Generate Form button...');
        await this.page.locator(this.generateBtn).first().click();
    }

    async verifyFormCreated() {
        console.log('Verifying form creation success...');
        // Wait for success toast or redirection to capture page
        // Match 'forms/form_' which indicates a created form, regardless of the hash (#landing, #capture etc.)
        await this.page.waitForURL(/.*forms\/form_.*/, { timeout: 60000 });
    }
    async clickSaveAndNext() {
        console.log('Clicking Save & Next button...');
        const btn = this.page.getByRole('button', { name: /save.*next/i }).first();
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click({ force: true });
    }

    async clickSaveAndShare() {
        console.log('Clicking Save & Share button...');
        const btn = this.page.getByRole('button', { name: /save.*share/i }).first();
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click({ force: true });
    }

    async clickFormPreview() {
        const previewLink = this.page.locator('a#form-preview-btn');

        await previewLink.waitFor({ state: 'visible', timeout: 30000 });

        const [popup] = await Promise.all([
            this.page.waitForEvent('popup', { timeout: 10000 }),
            previewLink.click()
        ]);

        this.previewPage = popup;
        await popup.waitForLoadState();

        console.log('Form Preview opened in new tab');
    }



    async verifyRedirectTo(pageName) {
        // Generic verifier based on URL
        // user info -> /user-info
        // thank you -> /thank-you
        // settings -> /settings
        console.log(`Verifying redirect to ${pageName}...`);
        const urlPattern = new RegExp(pageName.replace(/ /g, '-').toLowerCase());
        await this.page.waitForURL(urlPattern, { timeout: 30000 });
    }

    // --- Preview Page Actions (operating on this.previewPage) ---

    async cxClickWriteYourFeedback() {
        // Use popup page if preview opened in new tab, else main page
        const page = this.previewPage || this.page;

        const feedbackBtn = page.locator('#preview-write-text');

        await feedbackBtn.waitFor({ state: 'visible', timeout: 30000 });
        await feedbackBtn.click({ force: true });

        console.log('Clicked Write Your Feedback button');
    }

    async cxClickStarRating() {
        const page = this.previewPage || this.page;

        const star = page.locator("div[id='icon-type-star'] span:nth-child(2) svg");

        // Check if the element exists
        if ((await star.count()) === 0) {
            console.log('Star rating not present for this form, skipping...');
            return;
        }

        await star.first().waitFor({ state: 'visible', timeout: 10000 });
        await star.first().scrollIntoViewIfNeeded();

        // Try normal click first, fallback to JS click
        try {
            await star.first().click({ force: true });
        } catch (e) {
            console.log('Normal click failed, attempting JS click...');
            await page.evaluate(el => el.click(), await star.first().elementHandle());
        }

        console.log('Clicked star rating');
    }




    async cxEnterFeedback(feedbackText) {
        const page = this.previewPage || this.page; // Use preview tab if open

        const textarea = page.locator('#text-review-comment');

        // Check if textarea exists and is visible
        if (await textarea.count() > 0) {
            if (await textarea.isVisible()) {
                await textarea.scrollIntoViewIfNeeded();
                await textarea.fill(feedbackText, { timeout: 10000 });
                console.log('Feedback entered successfully');
            } else {
                console.log('Textarea exists but is not visible. Skipping.');
            }
        } else {
            console.log('Textarea does not exist. Skipping.');
        }
    }


    async cxClickSubmitFeedback() {
        if (!this.previewPage) throw new Error('Preview page not open');

        const page = this.previewPage;
        const submitBtn = page.locator('#submit-text-review');

        // Wait for the button to be visible and enabled
        await submitBtn.waitFor({ state: 'visible', timeout: 30000 });

        // Click the button
        await submitBtn.click({ force: true });
        console.log('Clicked Submit Feedback button');
    }

    async cxClickSubmitAgain() {
        if (!this.previewPage) throw new Error('Preview page not open');
        console.log('Clicking secondary Submit button (if any)...');
        // Sometimes there's a confirmation or "Send" button
        // If exact text is "Submit", use checking logic
        const btn = this.previewPage.locator('button:has-text("Submit")').first();
        if (await btn.isVisible()) {
            await btn.click();
        } else {
            console.log('Secondary submit button not found, assuming single submit.');
        }
    }

    async cxVerifySuccessMessage(msg) {
        if (!this.previewPage) throw new Error('Preview page not open');
        console.log(`Verifying success message: "${msg}"`);
        await expect(this.previewPage.locator(`text=${msg}`)).toBeVisible({ timeout: 30000 });
    }

    async cxCloseTab() {
        if (!this.previewPage) throw new Error('Preview page not open');
        console.log('Closing preview tab...');
        await this.previewPage.close();
        this.previewPage = null;
        await this.page.bringToFront();
    }
}

module.exports = { FormsPage };
