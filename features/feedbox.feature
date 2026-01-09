@feedbox
Feature: Feedbox Review Management
  As a logged-in user
  I want to manage reviews in Feedbox
  So that I can organize, filter, delete, mark favourite, and export reviews

# -------------------------------
# Background: Login & Navigation
# -------------------------------
Background: User is logged in and navigated to Feedbox
  Given the user navigates to "https://app.feedspace.io/login?ma=1"
  When the user enters the email "sarika.tier4@gmail.com" in the email field
  And the user enters the password "qa123" in the password field
  And the user clicks on the Login button
  Then the user should be logged in successfully
  And the user should be redirected to the workspace
  And the user clicks on the button "Launch Workspace"
  Then the user should be redirected to the dashboard
  When the user clicks on the Feedbox menu
  Then the Feedbox page should be displayed

# -------------------------------
# Scenario 1: Mark Reviews as Favourite
# -------------------------------
@favorite
Scenario: Mark selected reviews as favourite
  When the user clicks on the select reviews option
  And the user selects all reviews
  And the user clicks on the Favourite icon
  Then the user confirms adding to favorites
  Then the message "Marked favourite successfully" should be displayed
# -------------------------------
# Scenario 2: Unmark Reviews as Favourite
# -------------------------------
@unfavorite
Scenario: Unmark favourite reviews
  When the user clicks on the select reviews option
  And the user clicks the check box of first review
  And the user clicks on the Unfavourite icon
  Then the confirmation popup "Remove from favorites" should be displayed
  When the user clicks on Remove button 
  Then the message "Marked unfavourite successfully" should be displayed


# -------------------------------
# Scenario 3: Apply and remove label from a review
# -------------------------------
@label-apply
Scenario: Apply existing label to unlabeled review
  When the user clicks on the select reviews option
  And the user clicks the checkbox of the first review
  And the user clicks on the Label icon
  And the user clicks on the label "automation" from the label dropdown
  Then the label "automation" should be attached to the review
  And the user prints "Label is attached to the review"
  And the user closed the label modal

  # -------------------------------
  # Scenario 4: Remove label from a review
  # -------------------------------
  @label-remove
  Scenario: Remove label from a review
    When the user refreshes the page
    When the user clicks on the select reviews option
    And the user selects a review with label "automation"
    And the user clicks on the Label icon
    And the user clicks on the label "automation" from the label dropdown
    Then the label "automation" should be removed from the review
    And the user prints "Label is removed from the review"
    And the user closed the label modal


