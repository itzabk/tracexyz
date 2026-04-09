const LogConfig = require("../config/logConfig");

const { checkOrCreateDirectory } = require("../helpers/file");

const { LOG_LEVELS } = require("../constants/index");

const fs = require("node:fs/promises");

const path = require("node:path");

module.exports = class Logger {
  #config = LogConfig.withDefaultConfig();

  #fileHandle;

  async #log(message, logLevel) {
    if (logLevel < this.#config.level || !this.#fileHandle) {
      return;
    }
    await this.#rolling_check();
    await this.#fileHandle.write(message);
  }

  static withDefaultConfig() {
    return new Logger();
  }

  static withLogConfig(logConfig) {
    return new Logger(logConfig);
  }

  constructor(logConfig = LogConfig.withDefaultConfig()) {
    LogConfig.assert(logConfig);
    this.#config = logConfig;
  }

  get config() {
    return this.#config;
  }

  get level() {
    return this.#config.level;
  }

  get filePrefix() {
    return this.#config.filePrefix;
  }

  get sizeThreshold() {
    return this.#config.logRotateConfig.sizeThreshold;
  }

  get timeThreshold() {
    return this.#config.logRotateConfig.timeThreshold;
  }

  async init() {
    const logDir = checkOrCreateDirectory("logs");
    const fileName =
      this.#config.filePrefix +
      new Date().toISOString().replace(/[:.]/g, "-") +
      ".log";
    this.#fileHandle = await fs.open(path.join(logDir, fileName), "a+");
    console.log("File created successfully");
  }

  async debug(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.DEBUG);
  }

  async warn(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.WARN);
  }

  async info(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.INFO);
  }

  async critical(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.CRITICAL);
  }

  async error(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.ERROR);
  }

  async #rolling_check() {
    const { sizeThreshold, timeThreshold } = this.#config.logRotateConfig;
    const { size, birthtimeMs } = await this.#fileHandle.stat();
    const currentTime = new Date().getTime();
    if (
      size > sizeThreshold ||
      currentTime - birthtimeMs > timeThreshold * 1000
    ) {
      await this.#fileHandle.close();
      await this.init();
    }
  }
};
