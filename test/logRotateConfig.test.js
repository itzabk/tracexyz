const { expect } = require("chai");
const { LogRotateConfig } = require("../src/config/index");
const {
  RollingSizeOptions,
  RollingTimeOptions,
} = require("../src/config/rollingConfigOptions");

describe("LogRotateConfig Class", () => {
  describe("Static Methods - withDefaultConfig", () => {
    it("should create LogRotateConfig with default settings", () => {
      const config = LogRotateConfig.withDefaultConfig();
      expect(config).to.be.instanceOf(LogRotateConfig);
    });

    it("should have default time threshold (Hourly)", () => {
      const config = LogRotateConfig.withDefaultConfig();
      expect(config.timeThreshold).to.equal(RollingTimeOptions.Hourly);
    });

    it("should have default size threshold (FiveKB)", () => {
      const config = LogRotateConfig.withDefaultConfig();
      expect(config.sizeThreshold).to.equal(RollingSizeOptions.FiveKB);
    });
  });

  describe("Static Methods - withJSON", () => {
    it("should create config from JSON with timeThreshold", () => {
      const jsonConfig = { timeThreshold: RollingTimeOptions.Daily };
      const config = LogRotateConfig.withJSON(jsonConfig);
      expect(config).to.be.instanceOf(LogRotateConfig);
      expect(config.timeThreshold).to.equal(RollingTimeOptions.Daily);
    });

    it("should create config from JSON with sizeThreshold", () => {
      const jsonConfig = { sizeThreshold: RollingSizeOptions.OneMB };
      const config = LogRotateConfig.withJSON(jsonConfig);
      expect(config.sizeThreshold).to.equal(RollingSizeOptions.OneMB);
    });

    it("should create config from JSON with both thresholds", () => {
      const jsonConfig = {
        timeThreshold: RollingTimeOptions.Weekly,
        sizeThreshold: RollingSizeOptions.TenMB,
      };
      const config = LogRotateConfig.withJSON(jsonConfig);
      expect(config.timeThreshold).to.equal(RollingTimeOptions.Weekly);
      expect(config.sizeThreshold).to.equal(RollingSizeOptions.TenMB);
    });

    it("should ignore unknown properties", () => {
      const jsonConfig = {
        timeThreshold: RollingTimeOptions.Daily,
        unknownProp: "should be ignored",
      };
      const config = LogRotateConfig.withJSON(jsonConfig);
      expect(config.timeThreshold).to.equal(RollingTimeOptions.Daily);
    });
  });

  describe("Method - addSizeThreshold", () => {
    it("should set custom size threshold", () => {
      const config = LogRotateConfig.withDefaultConfig();
      config.addSizeThreshold(RollingSizeOptions.TenMB);
      expect(config.sizeThreshold).to.equal(RollingSizeOptions.TenMB);
    });

    it("should accept valid size options", () => {
      const config = LogRotateConfig.withDefaultConfig();
      const validSizes = [
        RollingSizeOptions.OneKB,
        RollingSizeOptions.OneMB,
        RollingSizeOptions.HundredMB,
      ];
      validSizes.forEach((size) => {
        config.addSizeThreshold(size);
        expect(config.sizeThreshold).to.equal(size);
      });
    });

    it("should return config for chaining", () => {
      const config = LogRotateConfig.withDefaultConfig();
      const result = config.addSizeThreshold(RollingSizeOptions.OneMB);
      expect(result).to.equal(config);
    });

    it("should support method chaining", () => {
      const config = LogRotateConfig.withDefaultConfig()
        .addSizeThreshold(RollingSizeOptions.TenMB)
        .addTimeThreshold(RollingTimeOptions.Daily);
      expect(config.sizeThreshold).to.equal(RollingSizeOptions.TenMB);
      expect(config.timeThreshold).to.equal(RollingTimeOptions.Daily);
    });
  });

  describe("Method - addTimeThreshold", () => {
    it("should set custom time threshold", () => {
      const config = LogRotateConfig.withDefaultConfig();
      config.addTimeThreshold(RollingTimeOptions.Daily);
      expect(config.timeThreshold).to.equal(RollingTimeOptions.Daily);
    });

    it("should accept valid time options", () => {
      const config = LogRotateConfig.withDefaultConfig();
      const validTimes = [
        RollingTimeOptions.Minutely,
        RollingTimeOptions.Daily,
        RollingTimeOptions.Yearly,
      ];
      validTimes.forEach((time) => {
        config.addTimeThreshold(time);
        expect(config.timeThreshold).to.equal(time);
      });
    });

    it("should return config for chaining", () => {
      const config = LogRotateConfig.withDefaultConfig();
      const result = config.addTimeThreshold(RollingTimeOptions.Weekly);
      expect(result).to.equal(config);
    });
  });

  describe("Getters", () => {
    it("should return timeThreshold via getter", () => {
      const config = LogRotateConfig.withDefaultConfig().addTimeThreshold(
        RollingTimeOptions.Weekly,
      );
      expect(config.timeThreshold).to.equal(RollingTimeOptions.Weekly);
    });

    it("should return sizeThreshold via getter", () => {
      const config = LogRotateConfig.withDefaultConfig().addSizeThreshold(
        RollingSizeOptions.TenMB,
      );
      expect(config.sizeThreshold).to.equal(RollingSizeOptions.TenMB);
    });
  });

  describe("Static assert method", () => {
    it("should always return true", () => {
      expect(LogRotateConfig.assert()).to.be.true;
      expect(LogRotateConfig.assert({})).to.be.true;
      expect(LogRotateConfig.assert("anything")).to.be.true;
    });
  });
});

describe("RollingTimeOptions Class", () => {
  describe("Static time constants", () => {
    it("should have Minutely constant", () => {
      expect(RollingTimeOptions.Minutely).to.equal(60);
    });

    it("should have Hourly constant (60 minutes)", () => {
      expect(RollingTimeOptions.Hourly).to.equal(3600);
    });

    it("should have Daily constant (24 hours)", () => {
      expect(RollingTimeOptions.Daily).to.equal(86400);
    });

    it("should have Weekly constant (7 days)", () => {
      expect(RollingTimeOptions.Weekly).to.equal(604800);
    });

    it("should have Monthly constant (30 days)", () => {
      expect(RollingTimeOptions.Monthly).to.equal(2592000);
    });

    it("should have Yearly constant (12 months)", () => {
      expect(RollingTimeOptions.Yearly).to.equal(31104000);
    });

    it("should have correct time unit conversions", () => {
      expect(RollingTimeOptions.Hourly).to.equal(
        RollingTimeOptions.Minutely * 60,
      );
      expect(RollingTimeOptions.Daily).to.equal(RollingTimeOptions.Hourly * 24);
      expect(RollingTimeOptions.Weekly).to.equal(RollingTimeOptions.Daily * 7);
    });
  });

  describe("Static assert method", () => {
    it("should accept valid time options", () => {
      expect(() => RollingTimeOptions.assert(RollingTimeOptions.Minutely)).to
        .not.throw;
      expect(() => RollingTimeOptions.assert(RollingTimeOptions.Hourly)).to.not
        .throw;
      expect(() => RollingTimeOptions.assert(RollingTimeOptions.Daily)).to.not
        .throw;
      expect(() => RollingTimeOptions.assert(RollingTimeOptions.Weekly)).to.not
        .throw;
      expect(() => RollingTimeOptions.assert(RollingTimeOptions.Monthly)).to.not
        .throw;
      expect(() => RollingTimeOptions.assert(RollingTimeOptions.Yearly)).to.not
        .throw;
    });

    it("should reject invalid time options", () => {
      expect(() => RollingTimeOptions.assert(999)).to.throw();
    });

    it("should reject negative values", () => {
      expect(() => RollingTimeOptions.assert(-60)).to.throw();
    });

    it("should reject non-numeric values", () => {
      expect(() => RollingTimeOptions.assert("daily")).to.throw();
    });
  });
});

describe("RollingSizeOptions Class", () => {
  describe("Static size constants", () => {
    it("should have OneKB constant", () => {
      expect(RollingSizeOptions.OneKB).to.equal(1024);
    });

    it("should have FiveKB constant", () => {
      expect(RollingSizeOptions.FiveKB).to.equal(5120);
    });

    it("should have TenKB constant", () => {
      expect(RollingSizeOptions.TenKB).to.equal(10240);
    });

    it("should have OneMB constant", () => {
      expect(RollingSizeOptions.OneMB).to.equal(1048576);
    });

    it("should have FiveMB constant", () => {
      expect(RollingSizeOptions.FiveMB).to.equal(5242880);
    });

    it("should have HundredMB constant", () => {
      expect(RollingSizeOptions.HundredMB).to.equal(104857600);
    });

    it("should have correct size unit conversions", () => {
      expect(RollingSizeOptions.OneMB).to.equal(
        RollingSizeOptions.OneKB * 1024,
      );
      expect(RollingSizeOptions.FiveKB).to.equal(RollingSizeOptions.OneKB * 5);
    });
  });

  describe("Static assert method", () => {
    it("should accept valid size options", () => {
      expect(() => RollingSizeOptions.assert(RollingSizeOptions.OneKB)).to.not
        .throw;
      expect(() => RollingSizeOptions.assert(RollingSizeOptions.OneMB)).to.not
        .throw;
      expect(() => RollingSizeOptions.assert(RollingSizeOptions.HundredMB)).to
        .not.throw;
    });

    it("should reject invalid size options", () => {
      expect(() => RollingSizeOptions.assert(999)).to.throw();
    });

    it("should reject sizes smaller than OneKB", () => {
      expect(() => RollingSizeOptions.assert(512)).to.throw();
    });

    it("should reject non-numeric values", () => {
      expect(() => RollingSizeOptions.assert("1MB")).to.throw();
    });
  });

  describe("Size comparisons", () => {
    it("should allow comparing sizes", () => {
      expect(RollingSizeOptions.OneKB).to.be.lessThan(RollingSizeOptions.OneMB);
      expect(RollingSizeOptions.HundredMB).to.be.greaterThan(
        RollingSizeOptions.OneMB,
      );
    });

    it("should support size ranges", () => {
      const sizes = [
        RollingSizeOptions.OneKB,
        RollingSizeOptions.FiveMB,
        RollingSizeOptions.HundredMB,
      ];
      const largeFiles = sizes.filter(
        (size) => size >= RollingSizeOptions.OneMB,
      );
      expect(largeFiles).to.have.lengthOf(2);
    });
  });
});
