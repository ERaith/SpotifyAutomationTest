Feature: As a user I expect to be able to visit the home page

  Background: 
    Given User is on the Login page
    And User logs in with:
      | username  | kobayshimaru+testing@gmail.com |
      | password  | HzXidmMRpEiH86A                |
      | firstName | Hubert                         |
      | lastName  | Farnsworth                     |
    And User should be shown thier account homepage
    And User navigates to the web player

  @dev
  Scenario: User can make a playlist for a 30 min road trip with no duplicates
    When User creates a playlist with name "Road Trip"
    And User adds "Talking Heads" songs totaling 30 min between 3 min and 6 min long
    And User checks total duration of the created playlist
    Then There should be no song duplicates

  @dev
  Scenario: User can make a playlist for a 30 min road trip with no duplicates
    When User creates a playlist with name "Road Trip"
    Then User sees the playlist populate in their sidebar
