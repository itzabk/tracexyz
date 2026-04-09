const LogConfig = require("../config/logConfig");

const fs = require("node:fs/promises");

module.exports = class Logger {
  #config = LogConfig.withDefaultConfig();

  #fileHandle;

  async #log(message, logLevel) {
    if (logLevel < this.#config.level) {
      return;
    }
    this.#fileHandle.write(message);
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
    const fileName =
      this.#config.filePrefix +
      newDate().toISOString().replace(/[\k ]/g, "-") +
      ".log";
    this.#fileHandle = await fs.open(fileName, "a+");
    console.log("File created successfully");
  }
};
