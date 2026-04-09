const path = require("node:path");

const fs = require("node:fs");

/**
 * Checks if a directory exists and creates it if it does not.
 * Creates the directory recursively if needed.
 *
 * @param {string} dirName - The name of the directory to check or create
 * @returns {string} The absolute path to the directory
 * @throws {Error} If directory creation fails
 */
function checkOrCreateDirectory(dirName) {
  const logDir = path.resolve(process.cwd(), dirName);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
}

module.exports = { checkOrCreateDirectory };
