Feature: Import Reviews
  As a user, I want to import reviews from multiple platforms
  so that I can manage them in Feedspace.

  Scenario: Login and Import reviews from selected platforms and create Page/Widget

    # Login Flow 
    Given the user navigates to "https://app.feedspace.io/login?ma=1"
    When the user enters the email "sarika.tier4@gmail.com" in the email field
    And the user enters the password "qa123" in the password field
    And the user clicks on the Login button
    Then the user should be logged in successfully
    And the user should be redirected to the workspace
    And the user clicks on the button "Launch Workspace"
    Then the user should be redirected to the dashboard

    # Import from Weblink
    When I click on the Import option
    And I navigate to the Import Reviews page
    And I select the platform "Import from Web Link"
    And I read the JSON file and enter the URL for "Weblink"
    And I click on the Import Reviews button
    Then I verify that the import success message appears

    # Import from Instagram Post
    When I select the platform "Instagram Post"
    And I read the JSON file and enter the URL for "Instagram Post"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from Facebook Reviews
    When I select the platform "Facebook Reviews"
    And I read the JSON file and enter the URL for "Facebook Reviews"
    And I click on the Import Post button
    Then I verify that the import success message appears
    And I close the import modal

    # Pages Flow
    And I click on the Pages link
    And I click on the Create Page button
    And I select the first 5 reviews
    And I click on Save and Next button
    And I click on Save and Next button
    And I click on Save and Share button
    When I click on the magic link and switch back to the original tab
    Then I click on the close button

    # Widgets Flow
    When I navigate to the Widgets page via menu
    And I select the Carousel template
    And I select the first 5 reviews for the widget
    And I click on Save and Next on widget page
    And I click on Save and Share on widget page
    Then I click on the Widget Preview button
    And I switch back to the original tab
    Then I click on the close button

  # -------------------------------
# Forms Flow (conditional Create/New Form)
# -------------------------------
@forms
Scenario: Create form and submit feedback successfully

    # Login Flow (Required for isolated run)
    Given the user navigates to "https://app.feedspace.io/login?ma=1"
    When the user enters the email "sarika.tier4@gmail.com" in the email field
    And the user enters the password "qa123" in the password field
    And the user clicks on the Login button
    Then the user should be logged in successfully
    And the user should be redirected to the workspace
    And the user clicks on the button "Launch Workspace"
    Then the user should be redirected to the dashboard

  When I navigate to the Forms page via menu
  And I click on the Create or New Form button if form exists
  And I enter the form prompt "Customer Satisfaction Survey" in the form prompt field
  Then I click on the Generate Form button
  And the form is created successfully
  And the user is redirected to the capture review page
  And I check the Allow Ratings checkbox
  And I disable it if enabled

  And I click on the Save and Next button
  And the user is redirected to the user info page

  And I click on the Save and Next button
  And the user is redirected to the thank you page

  And I click on the Save and Next button
  And the user is redirected to the settings page

  And I click on the Save and Share button
  And I click on the Form Preview button

  And I click on the Write Your Feedback button
  And I enter the feedback in the submit feedback field
  And I click on the Submit Feedback button
  And I click on the Submit button again

  Then I see the success message "Thank You for Your Feedback"
  And I switch back to the original tab
  And I click on the Close button
  
 # -------------------------------
# Analyze Flow
# -------------------------------
@analyze
Scenario: Generate analysis for all tabs
    # Login Flow
    Given the user navigates to "https://app.feedspace.io/login?ma=1"
    When the user enters the email "sarika.tier4@gmail.com" in the email field
    And the user enters the password "qa123" in the password field
    And the user clicks on the Login button
    Then the user should be logged in successfully
    And the user should be redirected to the workspace
    And the user clicks on the button "Launch Workspace"
    Then the user should be redirected to the dashboard

    # Navigate to Analyze page
    When the user navigates to the Analyze page via menu
    Then the Analyze page should be displayed

    # Overview tab
    When the user clicks on the "Overview" tab
    And the user clicks on Analyze Reviews
    Then the analysis results content should be checked for "Overview"
    Then the system should display an appropriate message based on results content
    And the user navigates to the "Positive Points" tab

    # Positive Points tab
    When the user clicks on the "Positive Points" tab
    And the user clicks on Analyze Reviews
    Then the analysis results content should be checked for "Positive Points"
    Then the system should display an appropriate message based on results content
    And the user navigates to the "Pain Points" tab

    # Pain Points tab
    When the user clicks on the "Pain Points" tab
    And the user clicks on Analyze Reviews
    Then the analysis results content should be checked for "Pain Points"
    Then the system should display an appropriate message based on results content
    And the user navigates to the "Improvements" tab

    # Improvements tab
    When the user clicks on the "Improvements" tab
    And the user clicks on Analyze Reviews
    Then the analysis results content should be checked for "Improvements"
    Then the system should display an appropriate message based on results content
