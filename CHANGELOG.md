<!-- markdownlint-disable MD022 MD024 MD026 MD032 MD041 -->

# Change Log

- based on [Keep a Changelog](http://keepachangelog.com/)
- adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
~~Removed, Changed, Deprecated, Added, Fixed, Security~~
- clarity node decoration rules for existing children (`el(node, ...)`)
- new class decorator
- component.textcontent
- security: all text injections through DOM API textContent and nodeValue

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
