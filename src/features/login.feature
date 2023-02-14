Feature: As a user I expect to be able to visit the home page

  Background: 
    Given User is on the "Login" page

  @smoke @dev
  Scenario: User should successfully log in to their account
    When User logs in with:
      | username  | kobayshimaru+testing@gmail.com |
      | password  | HzXidmMRpEiH86A                |
      | firstName | Hubert                         |
      | lastName  | Farnsworth                     |
    Then User should be shown thier account homepage

  @dev
  Scenario Outline: User is shown a error when invalid credentials are used
    Given User tries to login with: "<email>" and "<password>"
    Then User should see the error message: "<message>"

    Examples: 
      | email                          | password        | message                        |
      | kobayshimaru+testing           | HzXidmMRpEiH86A | Incorrect username or password |
      | kobayshimaru+testing@gmail.com | invalid         | Incorrect username or password |
