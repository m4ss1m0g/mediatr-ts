# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2022-08-02

### Changed

- Update packages versions

## [0.2.0] - 2021-03-01

This release support **Notifications**.

> Due to early stage of the project until release v1 is not possible to adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) consequentially breaking changes are added to this release.

### Added
  
- Added support for notification with `@NotificationHandler` attribute
- Added `dispatcher` property of type `IDispatcher` to `mediatorSettings`.
- Added `publish` method to `Mediator`
  
### Changed

- `@Handler` is now deprecated use `@requestHandler` instead.

### Breaking changes

- The `resolve` method of `IResolver` is changed from `resolve<T>(name: string): IRequestHandler<IRequest<T>, T>;` to `resolve<T>(name: string): T;` this is necessary because the resolver now is used by the request handler and by the dispatcher.

### Fixed issue

- [#1](https://github.com/m4ss1m0g/mediatr-ts/issues/1)

## [0.1.2] - 2021-02-27

- No code changes
- Added comments

## [0.1.1] - 2021-02-25

- No code changes
- Fixed README with github repository

## [0.1.0] - 2021-02-25

- Initial release

[0.2.0]: https://github.com/m4ss1m0g/mediatr-ts/compare/tag/v0.1.2...v0.2.0
[0.1.2]: https://github.com/m4ss1m0g/mediatr-ts/compare/tag/v0.1.2...v0.1.1
[0.1.1]: https://github.com/m4ss1m0g/mediatr-ts/compare/tag/v0.1.1...v0.1.0
[0.1.0]: https://github.com/m4ss1m0g/mediatr-ts/releases/tag/v0.1.0
