# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added

## [1.1.1] - 2018-12-06
### Fixed
- `autoCommit` will throw catched exception ([7f4f5ff](https://github.com/DeSmart/queuejs/commit/7f4f5ff5496dd8e659c5b68c4db8492762e81f46))

## [1.1.0] - 2017-10-31
### Added
- This CHANGELOG
- Middleware support
- `autoCommit` middleware
- `maxAttempts` middleware
- `debug` middleware
- `connector` convenience module

### Changed
- Replaced job handlers with middlewares

## [1.0.0] - 2017-10-20
### Added
- Queue manager
- Sync connector
- NULL connector
- Job object
- Job handlers

[Unreleased]: https://github.com/DeSmart/queuejs/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/DeSmart/queuejs/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/DeSmart/queuejs/compare/1.0.0...v1.1.0
[1.0.0]: https://github.com/DeSmart/queuejs/compare/157be2f...1.0.0
