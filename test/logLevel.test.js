const { expect } = require("chai");
const { LogLevel } = require("../src/config/index");
const { LOG_LEVELS } = require("../src/constants/index");

describe("LogLevel Class", () => {
  describe("Static level property", () => {
    it("should have all log level constants", () => {
      expect(LogLevel.level).to.have.all.keys(
        "debug",
        "info",
        "warn",
        "error",
        "critical",
      );
    });

    it("should have correct debug level value", () => {
      expect(LogLevel.level.debug).to.equal(LOG_LEVELS.DEBUG);
      expect(LogLevel.level.debug).to.equal(0);
    });

    it("should have correct info level value", () => {
      expect(LogLevel.level.info).to.equal(LOG_LEVELS.INFO);
      expect(LogLevel.level.info).to.equal(1);
    });

    it("should have correct warn level value", () => {
      expect(LogLevel.level.warn).to.equal(LOG_LEVELS.WARN);
      expect(LogLevel.level.warn).to.equal(2);
    });

    it("should have correct error level value", () => {
      expect(LogLevel.level.error).to.equal(LOG_LEVELS.ERROR);
      expect(LogLevel.level.error).to.equal(3);
    });

    it("should have correct critical level value", () => {
      expect(LogLevel.level.critical).to.equal(LOG_LEVELS.CRITICAL);
      expect(LogLevel.level.critical).to.equal(4);
    });

    it("should be frozen and immutable", () => {
      expect(Object.isFrozen(LogLevel.level)).to.be.true;
    });

    it("should not allow modification", () => {
      // In non-strict mode, trying to modify a frozen object silently fails
      // This test verifies the value doesn't change
      const originalValue = LogLevel.level.debug;
      LogLevel.level.debug = 100;
      expect(LogLevel.level.debug).to.equal(originalValue);
    });
  });

  describe("Static assert method", () => {
    it("should accept debug level", () => {
      expect(() => LogLevel.assert(LogLevel.level.debug)).to.not.throw();
    });

    it("should accept info level", () => {
      expect(() => LogLevel.assert(LogLevel.level.info)).to.not.throw();
    });

    it("should accept warn level", () => {
      expect(() => LogLevel.assert(LogLevel.level.warn)).to.not.throw();
    });

    it("should accept error level", () => {
      expect(() => LogLevel.assert(LogLevel.level.error)).to.not.throw();
    });

    it("should accept critical level", () => {
      expect(() => LogLevel.assert(LogLevel.level.critical)).to.not.throw();
    });

    it("should accept numeric log level values", () => {
      expect(() => LogLevel.assert(0)).to.not.throw();
      expect(() => LogLevel.assert(1)).to.not.throw();
      expect(() => LogLevel.assert(2)).to.not.throw();
      expect(() => LogLevel.assert(3)).to.not.throw();
      expect(() => LogLevel.assert(4)).to.not.throw();
    });

    it("should reject invalid log level", () => {
      expect(() => LogLevel.assert(999)).to.throw(
        "Invalid log level value specified",
      );
    });

    it("should reject negative log level", () => {
      expect(() => LogLevel.assert(-1)).to.throw();
    });

    it("should reject float log level", () => {
      expect(() => LogLevel.assert(1.5)).to.throw();
    });

    it("should reject string log level", () => {
      expect(() => LogLevel.assert("debug")).to.throw();
    });

    it("should reject null", () => {
      expect(() => LogLevel.assert(null)).to.throw();
    });

    it("should reject undefined", () => {
      expect(() => LogLevel.assert(undefined)).to.throw();
    });

    it("should reject object", () => {
      expect(() => LogLevel.assert({})).to.throw();
    });

    it("should reject array", () => {
      expect(() => LogLevel.assert([0, 1, 2])).to.throw();
    });
  });

  describe("Instance level getter", () => {
    it("should return level constants", () => {
      const logger = new LogLevel();
      expect(logger.level).to.deep.equal(LogLevel.level);
    });

    it("should return frozen object", () => {
      const logger = new LogLevel();
      expect(Object.isFrozen(logger.level)).to.be.true;
    });
  });

  describe("Log level ordering", () => {
    it("should maintain correct ordering", () => {
      expect(LogLevel.level.debug).to.be.lessThan(LogLevel.level.info);
      expect(LogLevel.level.info).to.be.lessThan(LogLevel.level.warn);
      expect(LogLevel.level.warn).to.be.lessThan(LogLevel.level.error);
      expect(LogLevel.level.error).to.be.lessThan(LogLevel.level.critical);
    });

    it("should have sequential values 0-4", () => {
      const levels = [
        LogLevel.level.debug,
        LogLevel.level.info,
        LogLevel.level.warn,
        LogLevel.level.error,
        LogLevel.level.critical,
      ];
      expect(levels).to.deep.equal([0, 1, 2, 3, 4]);
    });
  });

  describe("Log level comparison", () => {
    it("should allow comparing log levels", () => {
      expect(LogLevel.level.debug < LogLevel.level.info).to.be.true;
      expect(LogLevel.level.error > LogLevel.level.warn).to.be.true;
    });

    it("should allow filtering by level", () => {
      const minLevel = LogLevel.level.info;
      const testLevels = [
        LogLevel.level.debug,
        LogLevel.level.info,
        LogLevel.level.warn,
      ];
      const filteredLevels = testLevels.filter((level) => level >= minLevel);
      expect(filteredLevels).to.deep.equal([
        LogLevel.level.info,
        LogLevel.level.warn,
      ]);
    });
  });
});
