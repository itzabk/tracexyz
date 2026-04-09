const LogLevel = require("./logLevelConfig");
const LogRotateConfig = require("./logRotateConfig");
const fs = require("node:fs");
const path = require("node:path");

module.exports = class LogConfig {
  // private fields
  #level = LogLevel.level.debug;
  #logRotateConfig = LogRotateConfig.withDefaultConfig();
  #filePrefix = "trace_";

  // static methods
  static withDefaultConfig() {
    return new LogConfig();
  }

  // parsing file with config
  static withFilePath(filePath) {
    const JSON_FILE_REGEX = /^[^\\/:*?"<>|]+\.json$/i;
    const fileName = path.basename(filePath);
    const isValid = JSON_FILE_REGEX.test(fileName);
    if (!isValid) {
      throw new Error("Invalid file name or type provided");
    }
    const data = fs.readFileSync(filePath, { flag: "r", encoding: "utf-8" });
    const config = LogConfig.withJSON(JSON.parse(data));
    return config;
  }

  // parsing json config
  static withJSON(config) {
    let logConfig = new LogConfig();
    const configTypes = Object.keys(config);
    for (let type of configTypes) {
      switch (type) {
        case "level":
          logConfig = logConfig.addLogConfigLevel(config[type]);
          break;
        case "logRotateConfig":
          logConfig = logConfig.addLogRotateConfig(config[type]);
          break;
        case "filePrefix":
          logConfig = logConfig.addLogFilePrefix(config[type]);
          break;
        default:
          break;
      }
    }
    return logConfig;
  }

  // TODO: Complete this functionality
  static assert() {
    return true;
  }

  // prototype methods
  addLogConfigLevel(level) {
    LogLevel.assert(level);
    this.#level = level;
    return this;
  }

  addLogRotateConfig(config) {
    LogRotateConfig.assert(config);
    this.#logRotateConfig = config;
    return this;
  }

  addLogFilePrefix(filePrefix) {
    const regex = /^[a-zA-Z0-9._-]+$/;
    const isValid = regex.test(filePrefix);
    if (!isValid) {
      throw new Error("Invalid file prefix provided");
    }
    this.#filePrefix = filePrefix;
    return this;
  }

  get level() {
    return this.#level;
  }

  get filePrefix() {
    return this.#filePrefix;
  }

  get logRotateConfig() {
    return this.#logRotateConfig;
  }
};
