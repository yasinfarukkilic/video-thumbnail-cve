# CVE Report: OS Command Injection in video-thumbnail

Security vulnerability report for the npm package `video-thumbnail`.

## Summary

The `video-thumbnail` npm package (all versions through 1.2.0) is vulnerable to **OS Command Injection** (CWE-78). The `clip()` and `video()` functions pass unsanitized file paths into template literals and execute them via `child_process.exec()`, allowing arbitrary shell command execution.

## Details

See [VULNERABILITY-REPORT.md](VULNERABILITY-REPORT.md) for the full report.

## Status

- **Discovered by:** Yasin Faruk ([@yasinfarukkilic](https://github.com/yasinfarukkilic))
- **Date:** 2026-11-05
