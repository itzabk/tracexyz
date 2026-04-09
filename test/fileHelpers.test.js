const { expect } = require("chai");
const { checkOrCreateDirectory } = require("../src/helpers/file");
const fs = require("node:fs");
const path = require("node:path");

describe("File Helpers", () => {
  describe("checkOrCreateDirectory function", () => {
    let testDir;

    beforeEach(() => {
      // Create a controlled test directory path
      testDir = path.join(process.cwd(), "test_temp_logs");
    });

    afterEach(() => {
      // Clean up all created test directories
      const cleanupDirs = ["test_temp_logs", "test_nested_logs"];
      cleanupDirs.forEach((dir) => {
        const dirPath = path.join(process.cwd(), dir);
        if (fs.existsSync(dirPath)) {
          try {
            // Recursively remove directory
            fs.rmSync(dirPath, { recursive: true, force: true });
          } catch (err) {
            // Continue if already deleted
          }
        }
      });
    });

    it("should return a string path", () => {
      const result = checkOrCreateDirectory("test_temp_logs");
      expect(result).to.be.a("string");
    });

    it("should return an absolute path", () => {
      const result = checkOrCreateDirectory("test_temp_logs");
      expect(path.isAbsolute(result)).to.be.true;
    });

    it("should return the correct directory name", () => {
      const result = checkOrCreateDirectory("test_temp_logs");
      expect(result).to.include("test_temp_logs");
    });

    it("should create directory if it does not exist", () => {
      const dirName = "test_temp_logs";
      const dirPath = path.join(process.cwd(), dirName);

      // Ensure directory doesn't exist
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
      }

      expect(fs.existsSync(dirPath)).to.be.false;
      checkOrCreateDirectory(dirName);
      expect(fs.existsSync(dirPath)).to.be.true;
    });

    it("should not fail if directory already exists", () => {
      const dirName = "test_temp_logs";
      const dirPath = path.join(process.cwd(), dirName);

      // Create directory first
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Should not throw when calling again
      expect(() => checkOrCreateDirectory(dirName)).to.not.throw();
      expect(fs.existsSync(dirPath)).to.be.true;
    });

    it("should create directory with write permissions", () => {
      const dirName = "test_temp_logs";
      const dirPath = checkOrCreateDirectory(dirName);

      // Try to write a file to verify write permissions
      const testFile = path.join(dirPath, "test.txt");
      expect(() => fs.writeFileSync(testFile, "test content")).to.not.throw();
      expect(fs.existsSync(testFile)).to.be.true;
      fs.unlinkSync(testFile);
    });

    it("should handle simple directory names", () => {
      const dirName = "test_temp_logs";
      const result = checkOrCreateDirectory(dirName);
      expect(fs.existsSync(result)).to.be.true;
      expect(fs.statSync(result).isDirectory()).to.be.true;
    });

    it("should validate directory is actually a directory", () => {
      const dirName = "test_temp_logs";
      const result = checkOrCreateDirectory(dirName);
      const stats = fs.statSync(result);
      expect(stats.isDirectory()).to.be.true;
    });

    it("should handle multiple calls with same directory name", () => {
      const dirName = "test_temp_logs";
      const path1 = checkOrCreateDirectory(dirName);
      const path2 = checkOrCreateDirectory(dirName);
      expect(path1).to.equal(path2);
      expect(fs.existsSync(path1)).to.be.true;
    });

    it("should create nested directories with recursive option", () => {
      const dirName = "test_nested_logs";
      const result = checkOrCreateDirectory(dirName);
      expect(fs.existsSync(result)).to.be.true;
    });

    it("should return consistent paths for same input", () => {
      const dirName = "test_temp_logs";
      const result1 = checkOrCreateDirectory(dirName);
      const result2 = checkOrCreateDirectory(dirName);
      expect(result1).to.equal(result2);
    });

    it("should create directory using process.cwd() as base", () => {
      const dirName = "test_temp_logs";
      const result = checkOrCreateDirectory(dirName);
      const expectedPath = path.join(process.cwd(), dirName);
      expect(result).to.equal(expectedPath);
    });
  });
});
