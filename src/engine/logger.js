const LogConfig = require("../config/logConfig");

const { checkOrCreateDirectory } = require("../helpers/file");

const { LOG_LEVELS } = require("../constants/index");

const fs = require("node:fs/promises");

const path = require("node:path");

/**
 * Logger class for managing application logs with rotation support.
 * Provides different log levels (DEBUG, INFO, WARN, ERROR, CRITICAL) and
 * automatic log file rotation based on size and time thresholds.
 */
module.exports = class Logger {
  #config = LogConfig.withDefaultConfig();

  #fileHandle;

  /**
   * Writes a log message to the file if it meets the level threshold.
   * Checks for log rotation before writing.
   *
   * @private
   * @async
   * @param {string} message - The log message to write
   * @param {number} logLevel - The log level of this message (0-4)
   * @returns {Promise<void>}
   */
  async #log(message, logLevel) {
    if (logLevel < this.#config.level || !this.#fileHandle) {
      return;
    }
    await this.#rolling_check();
    await this.#fileHandle.write(message);
  }

  /**
   * Creates a new Logger instance with default configuration.
   *
   * @static
   * @returns {Logger} A new Logger instance with default configuration
   */
  static withDefaultConfig() {
    return new Logger();
  }

  /**
   * Creates a new Logger instance with a custom LogConfig.
   *
   * @static
   * @param {LogConfig} logConfig - The configuration object for the logger
   * @returns {Logger} A new Logger instance with the specified configuration
   */
  static withLogConfig(logConfig) {
    return new Logger(logConfig);
  }

  /**
   * Constructs a Logger instance.
   *
   * @constructor
   * @param {LogConfig} [logConfig=LogConfig.withDefaultConfig()] - The configuration for the logger
   * @throws {Error} If the provided logConfig is invalid
   */
  constructor(logConfig = LogConfig.withDefaultConfig()) {
    LogConfig.assert(logConfig);
    this.#config = logConfig;
  }

  /**
   * Gets the current logger configuration.
   *
   * @readonly
   * @returns {LogConfig} The logger's configuration object
   */
  get config() {
    return this.#config;
  }

  /**
   * Gets the current log level threshold.
   *
   * @readonly
   * @returns {number} The log level (0-4)
   */
  get level() {
    return this.#config.level;
  }

  /**
   * Gets the file prefix for log files.
   *
   * @readonly
   * @returns {string} The file prefix used for log files
   */
  get filePrefix() {
    return this.#config.filePrefix;
  }

  /**
   * Gets the size threshold for log rotation.
   *
   * @readonly
   * @returns {number} The size threshold in bytes
   */
  get sizeThreshold() {
    return this.#config.logRotateConfig.sizeThreshold;
  }

  /**
   * Gets the time threshold for log rotation.
   *
   * @readonly
   * @returns {number} The time threshold in seconds
   */
  get timeThreshold() {
    return this.#config.logRotateConfig.timeThreshold;
  }

  /**
   * Initializes the logger by creating the logs directory and opening a log file.
   * Must be called before logging any messages.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If the logs directory cannot be created or file cannot be opened
   */
  async init() {
    const logDir = checkOrCreateDirectory("logs");
    const fileName =
      this.#config.filePrefix +
      new Date().toISOString().replace(/[:.]/g, "-") +
      ".log";
    this.#fileHandle = await fs.open(path.join(logDir, fileName), "a+");
    console.log("File created successfully");
  }

  /**
   * Closes the log file handle.
   * Should be called when done logging to release system resources.
   *
   * @async
   * @returns {Promise<void>}
   */
  async close() {
    if (this.#fileHandle) {
      await this.#fileHandle.close();
      this.#fileHandle = null;
    }
  }

  /**
   * Logs a debug level message.
   * Only writes if current log level allows DEBUG messages.
   *
   * @async
   * @param {string} [logMessage=""] - The message to log
   * @returns {Promise<void>}
   */
  async debug(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.DEBUG);
  }

  /**
   * Logs a warning level message.
   * Only writes if current log level allows WARN messages.
   *
   * @async
   * @param {string} [logMessage=""] - The message to log
   * @returns {Promise<void>}
   */
  async warn(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.WARN);
  }

  /**
   * Logs an info level message.
   * Only writes if current log level allows INFO messages.
   *
   * @async
   * @param {string} [logMessage=""] - The message to log
   * @returns {Promise<void>}
   */
  async info(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.INFO);
  }

  /**
   * Logs a critical level message.
   * Only writes if current log level allows CRITICAL messages.
   *
   * @async
   * @param {string} [logMessage=""] - The message to log
   * @returns {Promise<void>}
   */
  async critical(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.CRITICAL);
  }

  /**
   * Logs an error level message.
   * Only writes if current log level allows ERROR messages.
   *
   * @async
   * @param {string} [logMessage=""] - The message to log
   * @returns {Promise<void>}
   */
  async error(logMessage = "") {
    await this.#log(logMessage, LOG_LEVELS.ERROR);
  }

  /**
   * Checks if log rotation is needed based on size or time thresholds.
   * If rotation is needed, closes the current file and initializes a new one.
   *
   * @private
   * @async
   * @returns {Promise<void>}
   */
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
