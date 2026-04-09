const path = require("node:path");

const fs = require("node:fs");

function checkOrCreateDirectory(dirName) {
  const logDir = path.resolve(require.main.path, dirName);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
}

module.exports = { checkOrCreateDirectory };
