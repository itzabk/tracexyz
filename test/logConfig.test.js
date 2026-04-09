const { expect } = require("chai");
const { LogConfig } = require("../src/config/index");
const { LogLevel } = require("../src/config/index");
const { LogRotateConfig } = require("../src/config/index");
const { LOG_LEVELS } = require("../src/constants/index");
const path = require("node:path");

describe("LogConfig Class", () => {
  describe("Static Methods - withDefaultConfig", () => {
    it("should create LogConfig with default settings", () => {
      const config = LogConfig.withDefaultConfig();
      expect(config).to.be.instanceOf(LogConfig);
      expect(config.level).to.equal(LOG_LEVELS.DEBUG);
      expect(config.filePrefix).to.equal("trace_");
    });

    it("should have default LogRotateConfig", () => {
      const config = LogConfig.withDefaultConfig();
      expect(config.logRotateConfig).to.be.instanceOf(LogRotateConfig);
    });
  });

  describe("Static Methods - withFilePath", () => {
    it("should load config from JSON file", () => {
      const testFilePath = path.join(__dirname, "sample.json");
      const config = LogConfig.withFilePath(testFilePath);
      expect(config).to.be.instanceOf(LogConfig);
    });

    it("should throw error for non-JSON file", () => {
      expect(() => LogConfig.withFilePath("/path/to/file.txt")).to.throw(
        "Invalid file name or type provided",
      );
    });

    it("should throw error for invalid file name format", () => {
      expect(() => LogConfig.withFilePath("/path/to/invalid:file.json")).to
        .throw;
    });

    it("should throw error for non-existent file", () => {
      expect(() =>
        LogConfig.withFilePath(path.join(__dirname, "nonexistent.json")),
      ).to.throw();
    });
  });

  describe("Static Methods - withJSON", () => {
    it("should create config from JSON object with level", () => {
      const jsonConfig = { level: LOG_LEVELS.INFO };
      const config = LogConfig.withJSON(jsonConfig);
      expect(config).to.be.instanceOf(LogConfig);
      expect(config.level).to.equal(LOG_LEVELS.INFO);
    });

    it("should create config from JSON object with filePrefix", () => {
      const jsonConfig = { filePrefix: "app_" };
      const config = LogConfig.withJSON(jsonConfig);
      expect(config.filePrefix).to.equal("app_");
    });

    it("should create config from JSON object with logRotateConfig", () => {
      const jsonConfig = {
        logRotateConfig: {
          timeThreshold: 3600,
          sizeThreshold: 1048576,
        },
      };
      const config = LogConfig.withJSON(jsonConfig);
      expect(config.logRotateConfig).to.be.instanceOf(LogRotateConfig);
    });

    it("should handle all properties together", () => {
      const jsonConfig = {
        level: LOG_LEVELS.WARN,
        filePrefix: "test_",
        logRotateConfig: {
          timeThreshold: 3600,
          sizeThreshold: 1048576,
        },
      };
      const config = LogConfig.withJSON(jsonConfig);
      expect(config.level).to.equal(LOG_LEVELS.WARN);
      expect(config.filePrefix).to.equal("test_");
    });

    it("should ignore unknown properties", () => {
      const jsonConfig = {
        level: LOG_LEVELS.INFO,
        unknownProp: "should be ignored",
      };
      const config = LogConfig.withJSON(jsonConfig);
      expect(config.level).to.equal(LOG_LEVELS.INFO);
    });

    it("should throw error for invalid log level", () => {
      const jsonConfig = { level: 999 };
      expect(() => LogConfig.withJSON(jsonConfig)).to.throw();
    });
  });

  describe("Method - addLogConfigLevel", () => {
    it("should set valid log level", () => {
      const config = LogConfig.withDefaultConfig();
      config.addLogConfigLevel(LOG_LEVELS.ERROR);
      expect(config.level).to.equal(LOG_LEVELS.ERROR);
    });

    it("should validate log level", () => {
      const config = LogConfig.withDefaultConfig();
      expect(() => config.addLogConfigLevel(999)).to.throw();
    });

    it("should return config for chaining", () => {
      const config = LogConfig.withDefaultConfig();
      const result = config.addLogConfigLevel(LOG_LEVELS.WARN);
      expect(result).to.equal(config);
    });

    it("should support method chaining", () => {
      const config = LogConfig.withDefaultConfig()
        .addLogConfigLevel(LOG_LEVELS.INFO)
        .addLogFilePrefix("app_");
      expect(config.level).to.equal(LOG_LEVELS.INFO);
      expect(config.filePrefix).to.equal("app_");
    });
  });

  describe("Method - addLogFilePrefix", () => {
    it("should set valid file prefix", () => {
      const config = LogConfig.withDefaultConfig();
      config.addLogFilePrefix("myapp_");
      expect(config.filePrefix).to.equal("myapp_");
    });

    it("should accept alphanumeric characters", () => {
      const config = LogConfig.withDefaultConfig();
      config.addLogFilePrefix("app123_");
      expect(config.filePrefix).to.equal("app123_");
    });

    it("should accept dots, dashes, and underscores", () => {
      const config = LogConfig.withDefaultConfig();
      config.addLogFilePrefix("my-app_1.0");
      expect(config.filePrefix).to.equal("my-app_1.0");
    });

    it("should reject special characters", () => {
      const config = LogConfig.withDefaultConfig();
      expect(() => config.addLogFilePrefix("invalid@prefix")).to.throw(
        "Invalid file prefix provided",
      );
    });

    it("should reject spaces", () => {
      const config = LogConfig.withDefaultConfig();
      expect(() => config.addLogFilePrefix("invalid prefix")).to.throw();
    });

    it("should return config for chaining", () => {
      const config = LogConfig.withDefaultConfig();
      const result = config.addLogFilePrefix("app_");
      expect(result).to.equal(config);
    });
  });

  describe("Method - addLogRotateConfig", () => {
    it("should set log rotate config", () => {
      const config = LogConfig.withDefaultConfig();
      const rotateConfig = LogRotateConfig.withDefaultConfig();
      config.addLogRotateConfig(rotateConfig);
      expect(config.logRotateConfig).to.equal(rotateConfig);
    });

    it("should return config for chaining", () => {
      const config = LogConfig.withDefaultConfig();
      const rotateConfig = LogRotateConfig.withDefaultConfig();
      const result = config.addLogRotateConfig(rotateConfig);
      expect(result).to.equal(config);
    });
  });

  describe("Getters", () => {
    it("should return log level via getter", () => {
      const config = LogConfig.withDefaultConfig().addLogConfigLevel(
        LOG_LEVELS.WARN,
      );
      expect(config.level).to.equal(LOG_LEVELS.WARN);
    });

    it("should return file prefix via getter", () => {
      const config = LogConfig.withDefaultConfig().addLogFilePrefix("test_");
      expect(config.filePrefix).to.equal("test_");
    });

    it("should return logRotateConfig via getter", () => {
      const config = LogConfig.withDefaultConfig();
      expect(config.logRotateConfig).to.be.instanceOf(LogRotateConfig);
    });
  });

  describe("Immutability", () => {
    it("should not affect default config when modifying instance", () => {
      const config1 = LogConfig.withDefaultConfig().addLogConfigLevel(
        LOG_LEVELS.INFO,
      );
      const config2 = LogConfig.withDefaultConfig();
      expect(config2.level).to.equal(LOG_LEVELS.DEBUG);
      expect(config1.level).to.equal(LOG_LEVELS.INFO);
    });
  });
});
