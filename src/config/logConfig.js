const LogLevel = require("./logLevelConfig");
const LogRotateConfig = require("./logRotateConfig");
const fs = require("node:fs");
const path = require("node:path");

/**
 * Configuration class for the Logger.
 * Manages log level, log rotation configuration, and file prefix settings.
 * Provides methods to create configurations from defaults, JSON objects, or JSON files.
 */
module.exports = class LogConfig {
  // private fields
  #level = LogLevel.level.debug;
  #logRotateConfig = LogRotateConfig.withDefaultConfig();
  #filePrefix = "trace_";

  /**
   * Creates a new LogConfig instance with default settings.
   *
   * @static
   * @returns {LogConfig} A new LogConfig with default configuration
   */
  static withDefaultConfig() {
    return new LogConfig();
  }

  /**
   * Loads configuration from a JSON file.
   * The file must be a valid JSON file with a .json extension.
   *
   * @static
   * @param {string} filePath - The absolute path to the JSON configuration file
   * @returns {LogConfig} A new LogConfig instance based on the file contents
   * @throws {Error} If file name/type is invalid or JSON parsing fails
   */
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

  /**
   * Creates a LogConfig from a JSON object.
   * Supports "level", "logRotateConfig", and "filePrefix" properties.
   *
   * @static
   * @param {Object} config - Configuration object
   * @param {number} [config.level] - Log level (0-4)
   * @param {Object} [config.logRotateConfig] - Log rotation settings
   * @param {string} [config.filePrefix] - Prefix for log files
   * @returns {LogConfig} A new LogConfig instance based on the JSON object
   * @throws {Error} If any configuration property is invalid
   */
  static withJSON(config) {
    let logConfig = new LogConfig();
    const configTypes = Object.keys(config);
    for (let type of configTypes) {
      switch (type) {
        case "level":
          logConfig = logConfig.addLogConfigLevel(config[type]);
          break;
        case "logRotateConfig":
          // Handle both plain objects and LogRotateConfig instances
          const rotateConfig =
            config[type] instanceof LogRotateConfig
              ? config[type]
              : LogRotateConfig.withJSON(config[type]);
          logConfig = logConfig.addLogRotateConfig(rotateConfig);
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

  /**
   * Validates a LogConfig instance.
   * TODO: Complete this functionality.
   *
   * @static
   * @param {LogConfig} [config] - The configuration to validate
   * @returns {boolean} True if valid
   */
  static assert() {
    return true;
  }

  /**
   * Sets the log level for this configuration.
   *
   * @param {number} level - The log level (0-4)
   * @returns {LogConfig} Returns this instance for method chaining
   * @throws {Error} If the provided log level is invalid
   */
  addLogConfigLevel(level) {
    LogLevel.assert(level);
    this.#level = level;
    return this;
  }

  /**
   * Sets the log rotation configuration for this configuration.
   *
   * @param {LogRotateConfig|Object} config - The log rotation configuration
   * @returns {LogConfig} Returns this instance for method chaining
   * @throws {Error} If the provided config is invalid
   */
  addLogRotateConfig(config) {
    LogRotateConfig.assert(config);
    this.#logRotateConfig = config;
    return this;
  }

  /**
   * Sets the file prefix for log files.
   * Must contain only alphanumeric characters, dots, dashes, and underscores.
   *
   * @param {string} filePrefix - The prefix for log file names
   * @returns {LogConfig} Returns this instance for method chaining
   * @throws {Error} If the file prefix contains invalid characters
   */
  addLogFilePrefix(filePrefix) {
    const regex = /^[a-zA-Z0-9._-]+$/;
    const isValid = regex.test(filePrefix);
    if (!isValid) {
      throw new Error("Invalid file prefix provided");
    }
    this.#filePrefix = filePrefix;
    return this;
  }

  /**
   * Gets the log level setting.
   *
   * @readonly
   * @returns {number} The log level (0-4)
   */
  get level() {
    return this.#level;
  }

  /**
   * Gets the log file prefix setting.
   *
   * @readonly
   * @returns {string} The file prefix
   */
  get filePrefix() {
    return this.#filePrefix;
  }

  /**
   * Gets the log rotation configuration.
   *
   * @readonly
   * @returns {LogRotateConfig} The log rotation configuration
   */
  get logRotateConfig() {
    return this.#logRotateConfig;
  }
};
