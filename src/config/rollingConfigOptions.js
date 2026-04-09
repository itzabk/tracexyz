/**
 * RollingTimeOptions class providing predefined time thresholds for log rotation.
 * All values are in seconds.
 */
class RollingTimeOptions {
  /**
   * 60 seconds - 1 minute
   * @static
   * @readonly
   * @type {number}
   */
  static Minutely = 60;

  /**
   * 3600 seconds - 1 hour
   * @static
   * @readonly
   * @type {number}
   */
  static Hourly = 60 * this.Minutely;

  /**
   * 86400 seconds - 1 day
   * @static
   * @readonly
   * @type {number}
   */
  static Daily = 24 * this.Hourly;

  /**
   * 604800 seconds - 1 week
   * @static
   * @readonly
   * @type {number}
   */
  static Weekly = 7 * this.Daily;

  /**
   * 2592000 seconds - 30 days
   * @static
   * @readonly
   * @type {number}
   */
  static Monthly = 30 * this.Daily;

  /**
   * 31104000 seconds - 1 year (360 days)
   * @static
   * @readonly
   * @type {number}
   */
  static Yearly = 12 * this.Monthly;

  /**
   * Validates that a time option is one of the predefined values.
   *
   * @static
   * @param {number} time_option - The time option to validate
   * @throws {Error} If the time option is not a valid RollingTimeOptions value
   */
  static assert(time_option) {
    if (
      ![
        this.Minutely,
        this.Hourly,
        this.Daily,
        this.Weekly,
        this.Monthly,
        this.Yearly,
      ].includes(time_option)
    ) {
      throw new Error(
        `time_option must be an instance of RollingConfig. Unsupported param
↪ ${JSON.stringify(time_option)}`,
      );
    }
  }
}

/**
 * RollingSizeOptions class providing predefined size thresholds for log rotation.
 * All values are in bytes.
 */
class RollingSizeOptions {
  /**
   * 1024 bytes - 1 KB
   * @static
   * @readonly
   * @type {number}
   */
  static OneKB = 1024;

  /**
   * 5120 bytes - 5 KB
   * @static
   * @readonly
   * @type {number}
   */
  static FiveKB = 5 * 1024;

  /**
   * 10240 bytes - 10 KB
   * @static
   * @readonly
   * @type {number}
   */
  static TenKB = 10 * 1024;

  /**
   * 20480 bytes - 20 KB
   * @static
   * @readonly
   * @type {number}
   */
  static TwentyKB = 20 * 1024;

  /**
   * 51200 bytes - 50 KB
   * @static
   * @readonly
   * @type {number}
   */
  static FiftyKB = 50 * 1024;

  /**
   * 102400 bytes - 100 KB
   * @static
   * @readonly
   * @type {number}
   */
  static HundredKB = 100 * 1024;

  /**
   * 524288 bytes - 512 KB
   * @static
   * @readonly
   * @type {number}
   */
  static HalfMB = 512 * 1024;

  /**
   * 1048576 bytes - 1 MB
   * @static
   * @readonly
   * @type {number}
   */
  static OneMB = 1024 * 1024;

  /**
   * 5242880 bytes - 5 MB
   * @static
   * @readonly
   * @type {number}
   */
  static FiveMB = 5 * 1024 * 1024;

  /**
   * 10485760 bytes - 10 MB
   * @static
   * @readonly
   * @type {number}
   */
  static TenMB = 10 * 1024 * 1024;

  /**
   * 20971520 bytes - 20 MB
   * @static
   * @readonly
   * @type {number}
   */
  static TwentyMB = 20 * 1024 * 1024;

  /**
   * 52428800 bytes - 50 MB
   * @static
   * @readonly
   * @type {number}
   */
  static FiftyMB = 50 * 1024 * 1024;

  /**
   * 104857600 bytes - 100 MB
   * @static
   * @readonly
   * @type {number}
   */
  static HundredMB = 100 * 1024 * 1024;

  /**
   * Validates that a size option is at least 1 KB.
   *
   * @static
   * @param {number} size_threshold - The size option to validate
   * @throws {Error} If size_threshold is not a number or less than 1 KB
   */
  static assert(size_threshold) {
    if (
      typeof size_threshold !== "number" ||
      size_threshold < RollingSizeOptions.OneKB
    ) {
      throw new Error(`size_threshold must be at-least 1 KB. Unsupported param
 ${JSON.stringify(size_threshold)}`);
    }
  }
}

module.exports = {
  RollingSizeOptions,
  RollingTimeOptions,
};
