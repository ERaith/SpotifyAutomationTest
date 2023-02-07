import { GlobalConfig, PageId, UserData } from "../env/global";

import { WebDriver } from "selenium-webdriver";
import Page from "./page";

/**
 * Page Constants
 */

const pageId: PageId = "login";
const pageRoute = "https://accounts.spotify.com/en/login";

export default class SpotifyLoginPage extends Page {
  /**
   * Get page elements
   * @returns {Object} page elements
   */

  constructor(driver: WebDriver, globalConfig: GlobalConfig) {
    super(driver, globalConfig, pageId, pageRoute);
  }

  get url(): string {
    return this.pageRoute;
  }

  get pageElementMappings() {
    return {
      loginButton: '[data-testid="login-button"]',
      signUpButton: '[data-testid="login-button"]',
      userNameInput: '[data-testid="login-username"]',
      passwordInput: '[data-testid="login-password"]',
      userInfo: '[data-testid="user-info"]',
      webPlayerLink: '[data-testid="web-player-link"]',
      accountOverviewLink: '[data-testid="account-settings-link"]',
      logoutButton: '[data-testid="logout-btn-link"]',
      errorMessage: '[role="alert"]',
    };
  }

  async enterLoginDetails(userLoginData: UserData) {
    const userInput = await this.findElementByCss("userNameInput");
    const passwordInput = await this.findElementByCss("passwordInput");

    await userInput.clear();
    await userInput.sendKeys(userLoginData.username);
    await passwordInput.sendKeys(userLoginData.password);
  }

  async submit() {
    const loginButton = await this.findElementByCss("loginButton");

    await loginButton.click();
  }
}
