Feature: AI-Native Feedspace Automation
  As a user, I want a fully automated, self-healing test suite for Feedspace
  That imports reviews, creates pages, and widgets with daily reporting.

  Scenario: Daily AI-Native Workflow Execution
    Given I navigate to the Feedspace sign-in page
    When I enter the email "test1235@mailinator.com"
    And I click on "Send Sign-In Code" button
    And I fetch the OTP from Mailinator for user "test1235"
    And I enter the retrieved OTP
    Then I should be logged in successfully
    And I should be redirected to the workspace
    And I should click on the button "Launch Workspace"
    Then I should be redirected to the dashboard

    # Step 2: Loop Through All Platform Imports with AI logic
    When I execute dynamic imports for all platforms in "importlinks.json"

    # Step 3: Facebook Reviews Specific Check (as per requirement)
    And I verify Facebook Reviews import success

    # Step 4: Page/WOL Creation
    When I click on the Pages link
    And I execute the full Page creation flow with first 5 reviews

    # Step 5: Widgets Flow
    When I navigate to the Widgets page via menu
    And I execute the Carousel Widget flow with first 5 reviews

    # Step 6: Final Reporting
    Then I generate the final execution summary report
