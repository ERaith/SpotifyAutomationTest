import { WebDriver, By, WebElement } from "selenium-webdriver";
import {
  ElementKey,
  ElementLocator,
  GlobalConfig,
  PageId,
  PageRoute,
} from "../env/global";
import { commonElements } from "./index";

export default class Page {
  /**
   * Instantiate the object
   */
  constructor(
    dirver: WebDriver,
    globalConfig: GlobalConfig,
    pageId: PageId,
    pageRoute: PageRoute
  ) {
    this.driver = dirver;
    this.pageId = pageId;
    this.globalConfig = globalConfig;
    this.pageRoute = pageRoute;
  }

  driver: WebDriver;
  pageId: PageId;
  pageRoute: PageRoute;
  globalConfig: GlobalConfig;

  /**
   * Page Class Methods
   * Common would have any reused elements throughout the pages
   * TODO seperate out into seperate classes, header, footer etc.
   */
  get common() {
    return commonElements;
  }

  get pageElementMappings() {
    return {};
  }

  get url(): string {
    const { UI_AUTOMATION_HOST: hostName = "localhost" } = process.env;
    const hostPath = this.globalConfig.hostsConfig[`${hostName}`];
    return hostPath + this.pageRoute;
  }

  /**
   * Match the title
   * @param {string} expectedTitle - expected title to match
   */
  
  async navigate(): Promise<void> {
    await this.driver.get(this.url);
  }

  async getElementLocator(elementKey: ElementKey): Promise<ElementLocator> {
    const elementIdentifier =
      this.pageElementMappings[elementKey] || this.common[elementKey];

    if (!elementIdentifier) {
      throw Error(`Unable to find the ${elementKey} mapping`);
    }

    return elementIdentifier;
  }

  async findElementByCss(elementKey: ElementKey): Promise<WebElement> {
    let locator = this.getElementLocator(elementKey);
    return this.driver.findElement(By.css(locator));
  }

  async findElementsByCss(elementKey: ElementKey): Promise<WebElement> {
    let locator = this.getElementLocator(elementKey);
    return this.driver.findElements(By.css(locator));
  }

  async findElementByXpath(locator: ElementKey): Promise<WebElement> {
    return this.driver.findElement(By.xpath(locator));
  }
}
