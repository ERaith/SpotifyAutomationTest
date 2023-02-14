import { DataTable, Given, Then, When } from "@cucumber/cucumber";
import { PageId, UserData } from "../env/global";
import { SpotifyLoginPage } from "../pages";
const { expect } = require("chai");

Given(/User is on the "([^"]*)" page$/, async function (pageId: PageId) {
  this.page = await new SpotifyLoginPage(this.driver, this.globalConfig);
  await this.page.navigate();
});

When("User logs in with:", async function (userDataTable: DataTable) {
  const userLoginDetails = userDataTable.rowsHash() as UserData;
  this.sessionUserData = userLoginDetails;

  await this.page.enterLoginDetails(userLoginDetails);
  await this.page.submit();
});

Then("User should be shown thier account homepage", async function () {
  const { sessionUserData, page } = this;

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
});

When(
  "User tries to login with: {string} and {string}",
  async function (username: string, password: string) {
    const userLoginDetails = {
      username,
      password,
    };
    this.sessionUserData = userLoginDetails;

    await this.page.enterLoginDetails(userLoginDetails);
    await this.page.submit();
  }
);

Then(
  "User should see the error message: {string}",
  async function (expectedMessage: string) {
    const errorMessage = await this.page.findElementByCss("errorMessage");
    const errorMessageText = await errorMessage.getAttribute("innerText");

    expect(errorMessageText).to.contain(expectedMessage);
  }
);
