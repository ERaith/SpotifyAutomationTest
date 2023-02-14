import { Before, After } from "@cucumber/cucumber";
import { ScenarioWorld } from "./world";
import { env } from "../../env/parseEnv";
import * as fs from "fs";

Before(async function (scenario) {
  console.log(`Running cucumber scenario ${scenario.pickle.name}`);

  const ready = await this.init();
  return ready;
});

After(async function (this: ScenarioWorld, scenario) {
  const scenarioStatus = scenario.result?.status;

  if (scenarioStatus === "FAILED") {
    this.driver.takeScreenshot().then((image) => {
      this.attach(image, "image/png");
      fs.mkdirSync(env("SCREENSHOT_PATH"));
      fs.writeFileSync(
        `${env("SCREENSHOT_PATH")}${scenario.pickle.name}.png`,
        image,
        "base64"
      );
    });
  }

  // Sleep is in here as a hacky solution to ECONNREFUSED
  // caused by webdriver having an unresolved promise before quitting
  await this.driver.sleep(2000);
  await this.driver.quit();
});
