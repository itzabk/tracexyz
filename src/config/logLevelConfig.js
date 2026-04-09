const { LOG_LEVELS } = require("../constants/index");

/**
 * LogLevel class that provides standard log level definitions.
 * Provides static level constants and validation.
 */
module.exports = class LogLevel {
  /**
   * Static object containing standard log level values.
   * Frozen to prevent modification.
   *
   * @static
   * @readonly
   * @type {Object}
   * @property {number} debug - Debug level (0)
   * @property {number} info - Info level (1)
   * @property {number} warn - Warning level (2)
   * @property {number} error - Error level (3)
   * @property {number} critical - Critical level (4)
   */
  static level = Object.freeze({
    debug: LOG_LEVELS.DEBUG,
    info: LOG_LEVELS.INFO,
    warn: LOG_LEVELS.WARN,
    error: LOG_LEVELS.ERROR,
    critical: LOG_LEVELS.CRITICAL,
  });

  /**
   * Validates that a given log level is one of the supported levels.
   *
   * @static
   * @param {number} log_level - The log level to validate
   * @throws {Error} If the log level is not a valid value
   */
  static assert = function (log_level) {
    if (!Object.values(this.level).includes(log_level)) {
      throw new Error("Invalid log level value specified");
    }
  };

  /**
   * Gets the level constants.
   *
   * @readonly
   * @returns {Object} The log level constants
   */
  get level() {
    return LogLevel.level;
  }
};
