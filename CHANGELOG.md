# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2023-05-24

### Added

- Add cjs and esm examples

### Changes

- Update to Typescript V5
- Fix CJS / ESM module support
- Fix behaviour `setOrder` method

## [1.1.0] - 2023-05-13

### Added

- Support for ES Modules. This mitigates the bailout on optimizations warnings whem importing CommonJs packages on Angular applications [More info](https://angular.io/guide/build#configuring-commonjs-dependencies)

## [1.0.0] - 2023-03-11

### Added

- Added new pipeline behavior example to documentation.
- Added new example of reordering execution order for both notifications and pipeline behaviors to documentation.

### Changed

- Separated the documentation into "Core concepts", and then extracted the Dependency Injection part out as a separate section.
- Added new types called `INotificationClass` and `INotificationHandlerClass`. These are used for *classes* instead of *instances* of these types. The code wrongly had `INotification` specified in cases where the actual real type was `INotificationClass`. This also strengthens the code and makes it harder to write it wrong.
- The `publish` method on the `Mediator` now returns a `Promise<void>` instead of `Promise<void[]>`.
- The `Dispatcher` now just has two properties. `notifications` and `behaviors`, which control the handler mappings for each of them, and the order.
- Added support for Pipeline behaviors.
- A new decorator has been introduced for this.
- A new `IPipelineBehavior` interface, as well as a `IPipelineBehaviorClass` type has been introduced.
- Changed imports to type imports where possible, to speed up compilation, and decrease the chance of accidental circular dependencies.
- Added `"importsNotUsedAsValues": "error"` to the `tsconfig.json` file, so that the TypeScript compiler will give an error if a regular import is used where a type import could have been used instead. Again, to decrease the chance of accidental circular dependencies.
- Added `"strict": true` to the `tsconfig.json` file, so that we now have full TypeScript strictness in the project.

### Removed

- Removed the order in the notification handler decorator.
- Got rid of the `DispatcherInstance` class. Instead, we now have mapping classes (similar, but not entirely identical). See the rest of the notes.

## [0.4.0] - 2023-03-10

- Changed attribute name `RequestHandler` to `requestHandler`

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

- `@Handler` is now deprecated use `@RequestHandler` instead.

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
