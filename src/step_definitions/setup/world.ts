import { Builder, WebDriver } from "selenium-webdriver";
import {
  World,
  IWorldOptions,
  setWorldConstructor,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { env } from "../../env/parseEnv";
import { GlobalConfig, GlobalVariables, UserData } from "../../env/global";
import { stringIsOfOptions } from "../../support/options-helper";

import chrome from "selenium-webdriver/chrome";
import firefox from "selenium-webdriver/firefox";

export type Screen = {
  driver: WebDriver;
};

setDefaultTimeout(60 * 1000);

export class ScenarioWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);

    this.globalConfig = options.parameters as GlobalConfig;

    this.globalVariables = { currentScreen: "" };

    this.sessionUserData = {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
    };
  }

  globalConfig: GlobalConfig;
  globalVariables: GlobalVariables;
  screen!: Screen;
  page;
  sessionUserData: UserData;

  async init(): Promise<Screen> {
    const browser = await this.newBrowser();
    const browserBuilder = await this.browserBuilder(browser);
    const driver = browserBuilder.build();
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 5000 });

    this.screen = { driver };
    return this.screen;
  }

  private newBrowser = async (): Promise<string> => {
    const automationBrowser = env("UI_AUTOMATION_BROWSER");
    const automationBrowsers = ["chrome", "firefox", "safari"];
    const validAutomationBrowser = stringIsOfOptions(
      automationBrowser,
      automationBrowsers
    );
    return validAutomationBrowser;
  };

  private browserBuilder = async (browser): Promise<Builder> => {
    console.log(`🖥️ Executing on ${browser} browser`);

    const builder = new Builder();

    switch (browser) {
      case "chrome": {
        const chromeBrowserOptions = new chrome.Options();
        chromeBrowserOptions.addArguments(env("BROWSER_ARGUMENTS"));
        chromeBrowserOptions.setPageLoadStrategy("normal");
        return builder
          .forBrowser(browser)
          .withCapabilities(chromeBrowserOptions);
      }
      case "firefox": {
        const firefoxBrowserOptions = new firefox.Options();
        firefoxBrowserOptions.addArguments(env("BROWSER_ARGUMENTS"));
        firefoxBrowserOptions.set("acceptInsecureCerts", true);
        return builder
          .forBrowser(browser)
          .setFirefoxOptions(firefoxBrowserOptions);
      }
      default: {
        return builder.forBrowser(browser);
      }
    }
  };
}

setWorldConstructor(ScenarioWorld);
