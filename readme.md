# TraceXYZ

[![npm version](https://badge.fury.io/js/tracexyz.svg)](https://badge.fury.io/js/tracexyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

TraceXYZ is a lightweight Node.js logger built for real-world debugging. It focuses on performance and simplicity while providing essential logging capabilities with automatic log rotation.

## Features

### Logging

- Asynchronous, non-blocking logging using an internal queue
- Support for log levels: `DEBUG`, `INFO`, `WARN`, `ERROR`, `CRITICAL`
- Timestamps on all log entries
- Customizable log message formatting
- File logging with configurable location
- Optional console output

### Performance and Reliability

- Batched writes for reduced I/O overhead
- Log rotation based on file size or time thresholds

## Installation

```bash
npm install tracexyz
```

### Requirements

- Node.js >= 14.0.0

## Quick Start

```javascript
const { Logger } = require("tracexyz");

// Create a logger with default configuration
const logger = Logger.withDefaultConfig();

// Initialize the logger (creates log directory and file)
await logger.init();

// Log messages
await logger.debug("This is a debug message");
await logger.info("This is an info message");
await logger.warn("This is a warning message");
await logger.error("This is an error message");
await logger.critical("This is a critical message");

// Close the logger when done
await logger.close();
```

## Configuration

TraceXYZ supports flexible configuration through the `LogConfig` class.

### Using Default Configuration

```javascript
const { Logger } = require("tracexyz");

const logger = Logger.withDefaultConfig();
```

### Custom Configuration

```javascript
const { Logger, LogConfig, LogRotateConfig } = require("tracexyz");
const { LOG_LEVELS } = require("tracexyz/src/constants");
const {
  RollingSizeOptions,
  RollingTimeOptions,
} = require("tracexyz/src/config");

const config = LogConfig.withDefaultConfig()
  .addLogConfigLevel(LOG_LEVELS.INFO) // Set minimum log level
  .addLogFilePrefix("myapp_") // Custom file prefix
  .addLogRotateConfig(
    new LogRotateConfig()
      .addSizeThreshold(RollingSizeOptions.TenMB) // Rotate at 10MB
      .addTimeThreshold(RollingTimeOptions.Daily), // Or daily
  );

const logger = Logger.withLogConfig(config);
```

### Configuration from JSON

```javascript
const { LogConfig } = require("tracexyz");

const config = LogConfig.withJSON({
  level: 1, // INFO level
  filePrefix: "app_",
  logRotateConfig: {
    sizeThreshold: 10485760, // 10MB in bytes
    timeThreshold: 86400, // 24 hours in seconds
  },
});

const logger = Logger.withLogConfig(config);
```

### Configuration from File

```javascript
const { LogConfig } = require("tracexyz");

const config = LogConfig.withFilePath("/path/to/config.json");
const logger = Logger.withLogConfig(config);
```

Example `config.json`:

```json
{
  "level": 0,
  "filePrefix": "sample_",
  "logRotateConfig": {
    "timeThreshold": 3600,
    "sizeThreshold": 5120
  }
}
```

## API Reference

### Logger Class

#### Static Methods

- `Logger.withDefaultConfig()` - Creates a logger with default configuration
- `Logger.withLogConfig(logConfig)` - Creates a logger with custom configuration

#### Instance Methods

- `init()` - Initializes the logger (must be called before logging)
- `close()` - Closes the logger and releases resources
- `debug(message)` - Logs a debug message
- `info(message)` - Logs an info message
- `warn(message)` - Logs a warning message
- `error(message)` - Logs an error message
- `critical(message)` - Logs a critical message

#### Getters

- `config` - Returns the current configuration
- `level` - Returns the current log level
- `filePrefix` - Returns the file prefix
- `sizeThreshold` - Returns the size threshold for rotation
- `timeThreshold` - Returns the time threshold for rotation

### LogConfig Class

#### Static Methods

- `LogConfig.withDefaultConfig()` - Creates default configuration
- `LogConfig.withJSON(jsonObject)` - Creates configuration from JSON object
- `LogConfig.withFilePath(filePath)` - Loads configuration from JSON file

#### Instance Methods

- `addLogConfigLevel(level)` - Sets the log level
- `addLogRotateConfig(config)` - Sets rotation configuration
- `addLogFilePrefix(prefix)` - Sets file prefix

### Log Levels

```javascript
const { LOG_LEVELS } = require("tracexyz/src/constants");

LOG_LEVELS.DEBUG; // 0
LOG_LEVELS.INFO; // 1
LOG_LEVELS.WARN; // 2
LOG_LEVELS.ERROR; // 3
LOG_LEVELS.CRITICAL; // 4
```

### Rotation Options

#### Size Options

```javascript
const { RollingSizeOptions } = require("tracexyz/src/config");

RollingSizeOptions.OneKB; // 1024 bytes
RollingSizeOptions.TenKB; // 10240 bytes
RollingSizeOptions.OneMB; // 1048576 bytes
RollingSizeOptions.TenMB; // 10485760 bytes
RollingSizeOptions.OneGB; // 1073741824 bytes
```

#### Time Options

```javascript
const { RollingTimeOptions } = require("tracexyz/src/config");

RollingTimeOptions.Minute; // 60 seconds
RollingTimeOptions.Hourly; // 3600 seconds
RollingTimeOptions.Daily; // 86400 seconds
RollingTimeOptions.Weekly; // 604800 seconds
```

## Log File Format

Log files are created in the `logs/` directory with the format:

```
{prefix}{timestamp}.log
```

Example: `trace_2023-05-14T10-30-00-000Z.log`

Each log entry includes a timestamp and the message.

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Repository

[https://github.com/itzabk/tracexyz](https://github.com/itzabk/tracexyz)

## Issues

Report bugs and request features at: [https://github.com/itzabk/tracexyz/issues](https://github.com/itzabk/tracexyz/issues)
