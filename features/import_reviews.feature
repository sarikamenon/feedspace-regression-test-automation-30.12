Feature: Import Reviews
  As a user, I want to import reviews from multiple platforms so that I can manage them in Feedspace.

  Scenario: Login and Import reviews from all platforms sequentially
    Given I navigate to the Feedspace sign-in page
    When I enter the email "test1235@mailinator.com"
    And I click on "Send Sign-In Code" button
    And I fetch the OTP from Mailinator for user "test1235"
    And I enter the retrieved OTP
    Then I should be logged in successfully
    And I should be redirected to the workspace
    And I should click on the button "Launch Workspace"
    Then I should be redirected to the dashboard

    # Import from Weblink
    When I click on the Import option
    And I navigate to the Import Reviews page
    And I select the import platform "Import from Web Link"
    And I read the JSON file, find the URL for platform "Weblink", and enter it into the URL text box
    And I click on the Import Reviews button
    Then I verify that the import success message appears

    # Import from Twitter
    When I select the platform "X (Twitter) Post"
    And I read the JSON file and enter the URL for "X (Twitter) Post"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from Facebook
    When I select the platform "Facebook Post"
    And I read the JSON file and enter the URL for "Facebook Post"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from Instagram
    When I select the platform "Instagram Post"
    And I read the JSON file and enter the URL for "Instagram Post"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from Threads
    When I select the platform "Threads Post"
    And I read the JSON file and enter the URL for "Threads Post"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from LinkedIn
    When I select the platform "LinkedIn Post"
    And I read the JSON file and enter the URL for "LinkedIn Post"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from YouTube
    When I select the platform "YouTube Video"
    And I read the JSON file and enter the URL for "YouTube Video"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from TikTok
    When I select the platform "TikTok Video"
    And I read the JSON file and enter the URL for "TikTok Video"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from Reddit Post
    When I select the platform "Reddit Post"
    And I read the JSON file and enter the URL for "Reddit Post"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from Reddit Comment
    When I select the platform "Reddit Comment"
    And I read the JSON file and enter the URL for "Reddit Comment"
    And I click on the Import Post button
    Then I verify that the import success message appears

    # Import from AppSumo
    When I select the platform "AppSumo"
    And I read the JSON file and enter the URL for "AppSumo"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Trustpilot
    When I select the platform "Trustpilot"
    And I read the JSON file and enter the URL for "Trustpilot"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Udemy
    When I select the platform "Udemy"
    And I read the JSON file and enter the URL for "Udemy"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Tripadvisor
    When I select the platform "Tripadvisor"
    And I read the JSON file and enter the URL for "Tripadvisor"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears



    # Import from Gumroad
    When I select the platform "Gumroad"
    And I read the JSON file and enter the URL for "Gumroad"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears
    
    # Import from Whop
    When I select the platform "Whop"
    And I read the JSON file and enter the URL for "Whop"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Fresha
    When I select the platform "Fresha"
    And I read the JSON file and enter the URL for "Fresha"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Healme
    When I select the platform "Healme"
    And I read the JSON file and enter the URL for "Healme"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Coursera
    When I select the platform "Coursera"
    And I read the JSON file and enter the URL for "Coursera"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Italki
    When I select the platform "Italki"
    And I read the JSON file and enter the URL for "Italki"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
Then I verify that the import success message appears

# Import from Google Play Store
When I select the platform "Google Play Store"
And I read the JSON file and enter the URL for "Google Play Store"
And I click on the Get Reviews button
And I click on select all checkbox
And I click on import reviews button
Then I verify that the import success message appears

# Import from Apple Podcast
When I select the platform "Apple Podcast"
And I read the JSON file and enter the URL for "Apple Podcast"
And I click on the Get Reviews button
And I click on select all checkbox
And I click on import reviews button
Then I verify that the import success message appears

# Import from App Store
When I select the platform "App Store"
And I read the JSON file and enter the URL for "App Store"
And I click on the Get Reviews button
And I click on select all checkbox
And I click on import reviews button
Then I verify that the import success message appears

# Import from HomeStars
When I select the platform "HomeStars"
And I read the JSON file and enter the URL for "HomeStars"
And I click on the Get Reviews button
And I click on select all checkbox
And I click on import reviews button
Then I verify that the import success message appears

# Import from Airbnb
When I select the platform "Airbnb"
And I read the JSON file and enter the URL for "Airbnb"
And I click on the Get Reviews button
And I click on select all checkbox
And I click on import reviews button
Then I verify that the import success message appears

# Import from Airbnb Experiences & Services
When I select the platform "Airbnb Experiences & Services"
And I read the JSON file and enter the URL for "Airbnb Experiences & Services"
And I click on the Get Reviews button
And I click on select all checkbox
And I click on import reviews button
Then I verify that the import success message appears

# Import from Booking.com
When I select the platform "Booking.com"
And I read the JSON file and enter the URL for "Booking.com"
And I click on the Get Reviews button
And I click on select all checkbox
And I click on import reviews button
Then I verify that the import success message appears

# Import from Product Hunt
When I select the platform "Product Hunt"
And I read the JSON file and enter the URL for "Product Hunt"
And I click on the Get Reviews button
And I click on select all checkbox
And I click on import reviews button
Then I verify that the import success message appears

# Import from Goodreads
When I select the platform "Goodreads"
And I read the JSON file and enter the URL for "Goodreads"
And I click on the Get Reviews button
And I click on select all checkbox
And I click on import reviews button
Then I verify that the import success message appears

    # Import from Facebook Reviews
    # Import from AppSumo
    When I select the platform "AppSumo"
    And I read the JSON file and enter the URL for "AppSumo"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Trustpilot
    When I select the platform "Trustpilot"
    And I read the JSON file and enter the URL for "Trustpilot"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Udemy
    When I select the platform "Udemy"
    And I read the JSON file and enter the URL for "Udemy"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Tripadvisor
    When I select the platform "Tripadvisor"
    And I read the JSON file and enter the URL for "Tripadvisor"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears


    # Import from Gumroad
    When I select the platform "Gumroad"
    And I read the JSON file and enter the URL for "Gumroad"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears
    
    # Import from Whop
    When I select the platform "Whop"
    And I read the JSON file and enter the URL for "Whop"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Fresha
    When I select the platform "Fresha"
    And I read the JSON file and enter the URL for "Fresha"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Healme
    When I select the platform "Healme"
    And I read the JSON file and enter the URL for "Healme"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Coursera
    When I select the platform "Coursera"
    And I read the JSON file and enter the URL for "Coursera"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Italki
    When I select the platform "Italki"
    And I read the JSON file and enter the URL for "Italki"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Google Play Store
    When I select the platform "Google Play Store"
    And I read the JSON file and enter the URL for "Google Play Store"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Apple Podcast
    When I select the platform "Apple Podcast"
    And I read the JSON file and enter the URL for "Apple Podcast"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from App Store
    When I select the platform "App Store"
    And I read the JSON file and enter the URL for "App Store"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from HomeStars
    When I select the platform "HomeStars"
    And I read the JSON file and enter the URL for "HomeStars"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Airbnb
    When I select the platform "Airbnb"
    And I read the JSON file and enter the URL for "Airbnb"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Airbnb Experiences & Services
    When I select the platform "Airbnb Experiences & Services"
    And I read the JSON file and enter the URL for "Airbnb Experiences & Services"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Booking.com
    When I select the platform "Booking.com"
    And I read the JSON file and enter the URL for "Booking.com"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Product Hunt
    When I select the platform "Product Hunt"
    And I read the JSON file and enter the URL for "Product Hunt"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Goodreads
    When I select the platform "Goodreads"
    And I read the JSON file and enter the URL for "Goodreads"
    And I click on the Get Reviews button
    And I click on select all checkbox
    And I click on import reviews button
    Then I verify that the import success message appears

    # Import from Facebook Reviews
    When I select the platform "Facebook Reviews"
    And I read the JSON file and enter the URL for "Facebook Reviews"
    And I click on the Import Post button
    Then I verify that the import success message appears
    And I close the import modal
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
