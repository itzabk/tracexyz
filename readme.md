# TraceXYZ

TraceXYZ is a lightweight Node.js logger built for real-world debugging. It focuses on performance and simplicity while adding useful capabilities like log replay and basic analysis to help you understand how your application behaves over time.

---

## Features

### Logging

- Asynchronous, non-blocking logging using an internal queue
- Support for log levels (debug, info, warning, error, critical)
- Timestamps on all log entries
- Customizable log message formatting
- File logging with configurable location
- Optional console output

### Performance and Reliability

- Batched writes for reduced I/O overhead
- Log rotation based on file size or time

### Replay

- Replay logs while preserving original time gaps
- Replay logs within a specific time window
- Adjustable replay speed

### Analysis

- Basic analysis for identifying error patterns and activity
- Optional AI-assisted summaries for deeper insights

---

## Installation

```bash
npm install tracexyz
```
