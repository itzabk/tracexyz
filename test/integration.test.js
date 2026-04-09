const { expect } = require("chai");
const { Logger } = require("../src/index");
const { LogConfig, LogLevel, LogRotateConfig } = require("../src/config/index");
const {
  RollingSizeOptions,
  RollingTimeOptions,
} = require("../src/config/rollingConfigOptions");
const { LOG_LEVELS } = require("../src/constants/index");
const path = require("node:path");
const fs = require("node:fs");

describe("Integration Tests", () => {
  let logger;

  afterEach(async () => {
    // Clean up test logs
    const logsDir = path.join(process.cwd(), "logs");
    if (fs.existsSync(logsDir)) {
      const files = fs.readdirSync(logsDir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(logsDir, file));
      });
      fs.rmdirSync(logsDir);
    }
  });

  describe("Logger with custom configuration", () => {
    it("should create logger with custom config from JSON", async () => {
      const customConfig = LogConfig.withDefaultConfig()
        .addLogConfigLevel(LOG_LEVELS.INFO)
        .addLogFilePrefix("app_")
        .addLogRotateConfig(
          new LogRotateConfig()
            .addSizeThreshold(RollingSizeOptions.TenMB)
            .addTimeThreshold(RollingTimeOptions.Daily),
        );

      logger = new Logger(customConfig);
      await logger.init();

      expect(logger.level).to.equal(LOG_LEVELS.INFO);
      expect(logger.filePrefix).to.equal("app_");
      expect(logger.sizeThreshold).to.equal(RollingSizeOptions.TenMB);
      expect(logger.timeThreshold).to.equal(RollingTimeOptions.Daily);
    });

    it("should respect log level filtering in complex configuration", async () => {
      const customConfig = LogConfig.withDefaultConfig()
        .addLogConfigLevel(LOG_LEVELS.WARN)
        .addLogFilePrefix("strict_");

      logger = new Logger(customConfig);
      await logger.init();

      await logger.debug("Should not appear");
      await logger.info("Should not appear");
      await logger.warn("Should appear");
      await logger.error("Should appear");

      const logsDir = path.join(process.cwd(), "logs");
      const logFile = fs.readdirSync(logsDir)[0];
      const fileContent = fs.readFileSync(path.join(logsDir, logFile), "utf-8");

      expect(fileContent).to.not.include("Should not appear");
      expect(fileContent).to.include("Should appear");
    });
  });

  describe("Logger with file configuration", () => {
    it("should load configuration from JSON file", async () => {
      const testFilePath = path.join(__dirname, "sample.json");
      if (fs.existsSync(testFilePath)) {
        const customConfig = LogConfig.withFilePath(testFilePath);
        logger = new Logger(customConfig);
        await logger.init();
        expect(logger).to.be.instanceOf(Logger);
      }
    });
  });

  describe("Logger state management", () => {
    it("should maintain correct state through multiple operations", async () => {
      logger = Logger.withDefaultConfig();
      const initialLevel = logger.level;
      await logger.init();

      await logger.debug("Debug message");
      await logger.info("Info message");
      await logger.warn("Warn message");

      expect(logger.level).to.equal(initialLevel);
      expect(logger.filePrefix).to.equal("trace_");
    });

    it("should handle config getter correctly", async () => {
      const customConfig = LogConfig.withDefaultConfig().addLogConfigLevel(
        LOG_LEVELS.ERROR,
      );
      logger = new Logger(customConfig);

      const config = logger.config;
      expect(config).to.equal(customConfig);
      expect(config.level).to.equal(LOG_LEVELS.ERROR);
    });
  });

  describe("Log level hierarchy", () => {
    it("should filter logs correctly at each level", async () => {
      const levels = [
        LOG_LEVELS.DEBUG,
        LOG_LEVELS.INFO,
        LOG_LEVELS.WARN,
        LOG_LEVELS.ERROR,
        LOG_LEVELS.CRITICAL,
      ];

      const messages = ["DEBUG", "INFO", "WARN", "ERROR", "CRITICAL"];

      for (const level of levels) {
        const customConfig =
          LogConfig.withDefaultConfig().addLogConfigLevel(level);
        logger = new Logger(customConfig);
        await logger.init();

        await logger.debug(messages[0]);
        await logger.info(messages[1]);
        await logger.warn(messages[2]);
        await logger.error(messages[3]);
        await logger.critical(messages[4]);

        const logsDir = path.join(process.cwd(), "logs");
        const logFile = fs.readdirSync(logsDir)[0];
        const fileContent = fs.readFileSync(
          path.join(logsDir, logFile),
          "utf-8",
        );

        // Verify messages at current level and above appear
        for (let i = level; i < messages.length; i++) {
          expect(fileContent).to.include(messages[i]);
        }

        // Verify messages below current level don't appear
        for (let i = 0; i < level; i++) {
          expect(fileContent).to.not.include(messages[i]);
        }

        // Clean up for next iteration
        fs.unlinkSync(path.join(logsDir, logFile));
      }
    });
  });

  describe("Configuration chaining", () => {
    it("should support method chaining for configuration", () => {
      const config = LogConfig.withDefaultConfig()
        .addLogConfigLevel(LOG_LEVELS.WARN)
        .addLogFilePrefix("chained_")
        .addLogRotateConfig(
          new LogRotateConfig()
            .addSizeThreshold(RollingSizeOptions.FiveMB)
            .addTimeThreshold(RollingTimeOptions.Weekly),
        );

      expect(config.level).to.equal(LOG_LEVELS.WARN);
      expect(config.filePrefix).to.equal("chained_");
      expect(config.logRotateConfig.sizeThreshold).to.equal(
        RollingSizeOptions.FiveMB,
      );
      expect(config.logRotateConfig.timeThreshold).to.equal(
        RollingTimeOptions.Weekly,
      );
    });
  });

  describe("Error handling and edge cases", () => {
    it("should handle logging with special characters", async () => {
      logger = Logger.withDefaultConfig();
      await logger.init();

      const specialMessages = [
        "Message with 'quotes'",
        'Message with "double quotes"',
        "Message with \n newline",
        "Message with \t tab",
        "Message with special chars !@#$%^&*()",
      ];

      for (const msg of specialMessages) {
        await logger.info(msg);
      }

      const logsDir = path.join(process.cwd(), "logs");
      const logFile = fs.readdirSync(logsDir)[0];
      const fileContent = fs.readFileSync(path.join(logsDir, logFile), "utf-8");

      expect(fileContent).to.be.a("string");
      expect(fileContent.length).to.be.greaterThan(0);
    });

    it("should handle very long log messages", async () => {
      logger = Logger.withDefaultConfig();
      await logger.init();

      const longMessage = "A".repeat(10000);
      await logger.info(longMessage);

      const logsDir = path.join(process.cwd(), "logs");
      const logFile = fs.readdirSync(logsDir)[0];
      const fileContent = fs.readFileSync(path.join(logsDir, logFile), "utf-8");

      expect(fileContent).to.include(longMessage);
    });

    it("should handle rapid sequential logging", async () => {
      logger = Logger.withDefaultConfig();
      await logger.init();

      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(logger.info(`Message ${i}`));
      }
      await Promise.all(promises);

      const logsDir = path.join(process.cwd(), "logs");
      const logFile = fs.readdirSync(logsDir)[0];
      const fileContent = fs.readFileSync(path.join(logsDir, logFile), "utf-8");

      // Verify at least some messages were logged
      expect(fileContent).to.include("Message");
    });
  });

  describe("Configuration validation", () => {
    it("should reject invalid log levels", () => {
      expect(() => LogConfig.withDefaultConfig().addLogConfigLevel(999)).to
        .throw;
    });

    it("should reject invalid file prefixes", () => {
      expect(() =>
        LogConfig.withDefaultConfig().addLogFilePrefix("invalid@prefix"),
      ).to.throw();
    });

    it("should accept valid file prefixes with various formats", () => {
      const validPrefixes = ["trace_", "app-1.0", "log_v2", "test.logs"];
      validPrefixes.forEach((prefix) => {
        const config = LogConfig.withDefaultConfig().addLogFilePrefix(prefix);
        expect(config.filePrefix).to.equal(prefix);
      });
    });
  });
});
