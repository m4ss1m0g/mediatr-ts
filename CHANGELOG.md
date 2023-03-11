# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2023-03-11

### Documentation
- Added new pipeline behavior example.
- Added new example of reordering execution order for both notifications and pipeline behaviors.
- Separated the documentation into "Core concepts", and then extracted the Dependency Injection part out as a separate section.

### Notification handlers
- Removed the order in the decorator. This is generally bad practise, because it breaks encapsulation. If one class knows about the order of the other classes implicitly, it is typically a smell. We can't remove the need for this entirely, but we can centralize it in one place so it's easier to see what the order of handlers are (see the new documentation on changing the order). That way, it is way less likely to implicitly break, and easier to keep track of. It also follows closer with Mediatr's own setup.
- Got rid of the `DispatcherInstance` class. Instead, we now have mapping classes (similar, but not entirely identical). See the rest of the notes.
- The `Dispatcher` has a property called `notifications` from where the notifications mappings are controlled (and execution order).
- Added new types called `INotificationClass` and `INotificationHandlerClass`. These are used for *classes* instead of *instances* of these types. The code wrongly had `INotification` specified in cases where the actual real type was `INotificationClass`. This also strengthens the code and makes it harder to write it wrong.
- The `publish` method on the `Mediator` now returns a `Promise<void>` instead of `Promise<void[]>`.

### Dispatcher
- The `Dispatcher` now just has two properties. `notifications` and `behaviors`, which control the handler mappings for each of them, and the order.

### Pipeline behaviors
- Added support for Pipeline behaviors.
- The `Dispatcher` has a property called `behaviors` from where the pipeline behavior mappings are controlled (and execution order).
- A new decorator has been introduced for this.
- A new `IPipelineBehavior` interface, as well as a `IPipelineBehaviorClass` type has been introduced.

### Boyscouting
- Changed imports to type imports where possible, to speed up compilation, and decrease the chance of accidental circular dependencies.
- Added `"importsNotUsedAsValues": "error"` to the `tsconfig.json` file, so that the TypeScript compiler will give an error if a regular import is used where a type import could have been used instead. Again, to decrease the chance of accidental circular dependencies.
- Added `"strict": true` to the `tsconfig.json` file, so that we now have full TypeScript strictness in the project.

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
