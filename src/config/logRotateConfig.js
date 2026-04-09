const {
  RollingSizeOptions,
  RollingTimeOptions,
} = require("./rollingConfigOptions");

module.exports = class LogRotateConfig {
  // Private fields
  #timeThreshold = RollingTimeOptions.Hourly;
  #sizeThreshold = RollingSizeOptions.FiveKB;

  // Static fields
  static withDefaultConfig() {
    return new LogRotateConfig();
  }

  static withJSON(config) {
    const logRotateConfig = new LogRotateConfig();
    Object.keys(config).forEach((key) => {
      switch (key) {
        case "timeThreshold":
          config = logRotateConfig.addTimeThreshold(config[key]);
          break;
        case "sizeThreshold":
          config = logRotateConfig.addSizeThreshold(config[key]);
          break;
      }
    });
    return logRotateConfig;
  }

  // TODO: Complete assert functionality
  static assert = () => {
    return true;
  };

  // prototype methods
  addSizeThreshold(config) {
    RollingSizeOptions.assert(config);
    this.#sizeThreshold = config;
    return this;
  }

  addTimeThreshold(config) {
    RollingTimeOptions.assert(config);
    this.#timeThreshold = config;
    return this;
  }

  get timeThreshold() {
    return this.#timeThreshold;
  }

  get sizeThreshold() {
    return this.#sizeThreshold;
  }
};
