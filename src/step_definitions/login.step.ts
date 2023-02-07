import { DataTable, Given, Then, When } from "@cucumber/cucumber";
import { PageId, UserData } from "../env/global";
import { SpotifyLoginPage } from "../pages";
import { ScenarioWorld } from "./setup/world";
const { expect, assert } = require("chai");

Given(
  /User is on the "([^"]*)" page$/,
  // {timeout:60*1000},
  async function (this: ScenarioWorld, pageId: PageId) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    this.page = await new SpotifyLoginPage(driver, globalConfig);
    await this.page.navigate();
  }
);

When(
  "User logs in with:",
  async function (this: ScenarioWorld, userDataTable: DataTable) {
    const {
      screen: { driver },
      page,
    } = this;

    const userLoginDetails = userDataTable.rowsHash() as UserData;
    this.sessionUserData = userLoginDetails;

    await page.enterLoginDetails(userLoginDetails);
    await page.submit();
  }
);

Then(
  "User should be shown thier account homepage",
  async function (this: ScenarioWorld) {
    const {
      screen: { driver },
      sessionUserData,
      page,
    } = this;

    const welcomeMessage = await page.findElementByCss("userInfo");
    const welcomeText = await welcomeMessage.getAttribute("innerText");
    const expectedWelcomeMessage = `Logged in as ${sessionUserData.firstName} ${sessionUserData.lastName}`;

    const accountLink = await page.findElementByCss("accountOverviewLink");
    const accountLinkText = await accountLink.getAttribute("innerText");
    const expectedAccountLinkText = "ACCOUNT OVERVIEW";

    const webPlayerLink = await page.findElementByCss("webPlayerLink");
    const webPlayerLinkText = await webPlayerLink.getAttribute("innerText");
    const expectedWebPlayerLinkText = "WEB PLAYER";

    const logoutButton = await page.findElementByCss("logoutButton");

    expect(welcomeText).to.contain(expectedWelcomeMessage);
    expect(accountLinkText).to.contain(expectedAccountLinkText);
    expect(webPlayerLinkText).to.contain(expectedWebPlayerLinkText);
    expect(await logoutButton.isDisplayed());
  }
);

When(
  "User tries to login with: {string} and {string}",
  async function (this: ScenarioWorld, username: string, password: string) {
    const {
      screen: { driver },
      page,
    } = this;

    const userLoginDetails = {
      username,
      password,
    };
    this.sessionUserData = userLoginDetails;

    await page.enterLoginDetails(userLoginDetails);
    await page.submit();
  }
);

Then(
  "User should see the error message: {string}",
  async function (this: ScenarioWorld, expectedMessage: string) {
    const { page } = this;

    const errorMessage = await page.findElementByCss("errorMessage");
    const errorMessageText = await errorMessage.getAttribute("innerText");

    expect(errorMessageText).to.contain(expectedMessage);
  }
);
