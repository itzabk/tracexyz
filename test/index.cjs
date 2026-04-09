const { Logger } = require("../src/index");
const { LogConfig } = require("../src/config/index");
const path = require("node:path");

// from file

async function initializeLogger() {
  const logger = Logger.withLogConfig(
    LogConfig.withFilePath(path.join(__dirname, "sample.json")),
  );
  await logger.init();
  return logger;
}

async function main() {
  const logger = await initializeLogger();
  await logger.error("Aiyooo Error occured!");
}

main();
