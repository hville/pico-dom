<!-- markdownlint-disable MD022 MD024 MD026 MD032 MD041 -->

# Change Log

- based on [Keep a Changelog](http://keepachangelog.com/)
- adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
~~Removed, Changed, Deprecated, Added, Fixed, Security~~
TODO: Reduce ctyp magic, clarify moveTo arguments, ...

## [0.12.0] - 2017-03-28
### Changed
- replaced `component.textContent` getter/setter with `component.setText()`
- simplified internal component map
- simplified internal event handling `on(...)` to `setEvent(n,f)` and `delEvent(n)`
- removed non essential decorators. `class` and `style` decorators must be added manually

## [0.11.0] - 2017-03-15
### Added
- `component.clone() => newComponent`
- `list.clone() => newList`

### Fixed
- `component.update(...) => this`
- `list.update(...) => this`
- documentation for `component.textContent`
- document fragment to update unmounted list

## [0.9.0] - 2017-03-12
### Changed
- Major API change: `.setWindow(window)` replaced `.window = window` to facilitate re-use for full application testing
- `ns` renamed to `namespaces` for clarity

### Added
- `component.textContent(text)` utility to avoid the `node.firstChild.nodeValue` boilerplate
- new `class` decorator

### Fixed
- documentation for textNodes and commentNodes

## [0.8.0] - 2017-02-26
### Changed
- Major API change: intermediate factory step removed
- `el(#)` and `el(!)` for text and comment nodes

## [0.6.0] - 2017-02-24
### Changed
- More major cleanup
- API change for the Environment setting (was `.global.document = doc`, now `.setWindow(win)`)

### Fixed
- Documentation

## [0.5.0] - 2017-02-21
### Changed
- Full rewrite
