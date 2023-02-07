import dotenv from "dotenv";

import { env, getJsonFromFile } from "./env/parseEnv";
import { GlobalConfig, HostsConfig } from "./env/global";

dotenv.config({ path: env("COMMON_CONFIG_FILE") });

const hostsConfig: HostsConfig = getJsonFromFile(env("HOSTS_URLS_PATH"));

const worldParamaters: GlobalConfig = {
  hostsConfig,
};

const common = `./src/features/**/*.feature \
    --require-module ts-node/register \
    --require ./src/step_definitions/**/**/*.ts \
    -f json:./reports/cucumber_report.json \
    --world-parameters ${JSON.stringify(worldParamaters)} \
    --format progress-bar `;

const dev = `${common} --tags '@dev'`;
const smoke = `${common} --tags '@smoke'`;
const regression = `${common} --tags '@regression'`;

console.log(`🥒 Running`);
export { dev, smoke, regression };
