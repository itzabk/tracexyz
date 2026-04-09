const {
  RollingSizeOptions,
  RollingTimeOptions,
} = require("./rollingConfigOptions");

/**
 * LogRotateConfig class for managing log file rotation settings.
 * Handles configuration of size and time-based rotation thresholds.
 */
module.exports = class LogRotateConfig {
  // Private fields
  #timeThreshold = RollingTimeOptions.Hourly;
  #sizeThreshold = RollingSizeOptions.FiveKB;

  /**
   * Creates a new LogRotateConfig instance with default settings.
   *
   * @static
   * @returns {LogRotateConfig} A new LogRotateConfig with default configuration
   */
  static withDefaultConfig() {
    return new LogRotateConfig();
  }

  /**
   * Creates a LogRotateConfig from a JSON object.
   * Supports "timeThreshold" and "sizeThreshold" properties.
   *
   * @static
   * @param {Object} config - Configuration object
   * @param {number} [config.timeThreshold] - Time threshold in seconds
   * @param {number} [config.sizeThreshold] - Size threshold in bytes
   * @returns {LogRotateConfig} A new LogRotateConfig instance
   * @throws {Error} If any configuration property is invalid
   */
  static withJSON(config) {
    const logRotateConfig = new LogRotateConfig();
    Object.keys(config).forEach((key) => {
      switch (key) {
        case "timeThreshold":
          logRotateConfig.addTimeThreshold(config[key]);
          break;
        case "sizeThreshold":
          logRotateConfig.addSizeThreshold(config[key]);
          break;
      }
    });
    return logRotateConfig;
  }

  /**
   * Validates a LogRotateConfig instance.
   * TODO: Complete assert functionality.
   *
   * @static
   * @returns {boolean} True if valid
   */
  static assert = () => {
    return true;
  };

  /**
   * Sets the size threshold for log rotation.
   *
   * @param {number} config - Size threshold in bytes
   * @returns {LogRotateConfig} Returns this instance for method chaining
   * @throws {Error} If the size threshold is invalid
   */
  addSizeThreshold(config) {
    RollingSizeOptions.assert(config);
    this.#sizeThreshold = config;
    return this;
  }

  /**
   * Sets the time threshold for log rotation.
   *
   * @param {number} config - Time threshold in seconds
   * @returns {LogRotateConfig} Returns this instance for method chaining
   * @throws {Error} If the time threshold is invalid
   */
  addTimeThreshold(config) {
    RollingTimeOptions.assert(config);
    this.#timeThreshold = config;
    return this;
  }

  /**
   * Gets the time threshold for log rotation.
   *
   * @readonly
   * @returns {number} Time threshold in seconds
   */
  get timeThreshold() {
    return this.#timeThreshold;
  }

  /**
   * Gets the size threshold for log rotation.
   *
   * @readonly
   * @returns {number} Size threshold in bytes
   */
  get sizeThreshold() {
    return this.#sizeThreshold;
  }
};
