const { expect } = require("chai");
const { LOG_LEVELS } = require("../src/constants/index");

describe("Constants", () => {
  describe("LOG_LEVELS object", () => {
    it("should have all required log levels", () => {
      expect(LOG_LEVELS).to.have.all.keys(
        "DEBUG",
        "INFO",
        "WARN",
        "ERROR",
        "CRITICAL",
      );
    });

    it("should have correct DEBUG level value", () => {
      expect(LOG_LEVELS.DEBUG).to.equal(0);
    });

    it("should have correct INFO level value", () => {
      expect(LOG_LEVELS.INFO).to.equal(1);
    });

    it("should have correct WARN level value", () => {
      expect(LOG_LEVELS.WARN).to.equal(2);
    });

    it("should have correct ERROR level value", () => {
      expect(LOG_LEVELS.ERROR).to.equal(3);
    });

    it("should have correct CRITICAL level value", () => {
      expect(LOG_LEVELS.CRITICAL).to.equal(4);
    });

    it("should be frozen and immutable", () => {
      expect(Object.isFrozen(LOG_LEVELS)).to.be.true;
    });

    it("should not allow modification of properties", () => {
      // In non-strict mode, trying to modify a frozen object silently fails
      // This test verifies the value doesn't change
      const originalValue = LOG_LEVELS.DEBUG;
      LOG_LEVELS.DEBUG = 100;
      expect(LOG_LEVELS.DEBUG).to.equal(originalValue);
    });

    it("should have numeric values in ascending order", () => {
      const values = Object.values(LOG_LEVELS);
      for (let i = 0; i < values.length - 1; i++) {
        expect(values[i]).to.be.lessThan(values[i + 1]);
      }
    });

    it("should allow comparison operations", () => {
      expect(LOG_LEVELS.DEBUG < LOG_LEVELS.INFO).to.be.true;
      expect(LOG_LEVELS.ERROR > LOG_LEVELS.WARN).to.be.true;
      expect(LOG_LEVELS.WARN <= LOG_LEVELS.WARN).to.be.true;
    });

    it("should be suitable for use in logging logic", () => {
      let logLevel = LOG_LEVELS.INFO;
      expect(LOG_LEVELS.DEBUG < logLevel).to.be.true;
      expect(LOG_LEVELS.INFO >= logLevel).to.be.true;
      expect(LOG_LEVELS.CRITICAL > logLevel).to.be.true;
    });
  });
});
