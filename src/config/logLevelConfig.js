const { LOG_LEVELS } = require("../constants/index");

module.exports = class LogLevel {
  // Static properties
  static level = Object.freeze({
    debug: LOG_LEVELS.DEBUG,
    info: LOG_LEVELS.INFO,
    warn: LOG_LEVELS.WARN,
    error: LOG_LEVELS.ERROR,
    critical: LOG_LEVELS.CRITICAL,
  });

  // Static methods
  static assert = function (log_level) {
    if (!Object.values(this.level).includes(log_level)) {
      throw new Error("Invalid log level value specified");
    }
  };

  get level() {
    return LogLevel.level;
  }
};
