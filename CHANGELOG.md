<!-- markdownlint-disable MD022 MD024 MD026 MD032 MD041 -->

# Change Log

- based on [Keep a Changelog](http://keepachangelog.com/)
- adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
~~Removed, Changed, Deprecated, Added, Fixed, Security~~

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
