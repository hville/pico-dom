<!-- markdownlint-disable MD022 MD024 MD026 MD032 MD041 -->

# Change Log

- based on [Keep a Changelog](http://keepachangelog.com/)
- adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
~~Removed, Changed, Deprecated, Added, Fixed, Security~~

## [0.33.0] - 2017-05-17
### Added
- component.common instead of .store and .state
- template function
- find function

## [0.30.0] - 2017-05-14
### Changed
- rewrite, simpler API, all components
- setDocument instead of defaultView

### Added
- Select List to conditionally display different components

## [0.20.0] - 2017-04-10
### Changed
- expose List
- moveto renamed to moveTo
- clear renamed to removeChildren

### Fixed
- fix Component and List methods to all return `this` instead of `Node`

## [0.19.0] - 2017-04-07
### Changed
- build system to ES5 modules with CJS and Browser Exports
- expose Component and List
- list.dataKey(v,i,a) instead of list.dataKey(v,i)
- Component(node, extra, key, index)

## [0.18.0] - 2017-04-04
### Changed
- all component decorators grouped under the `extra` decorator
- list.update performance improvement
- minimal WeakMap polyfill for older browsers

## [0.15.0] - 2017-04-02
### Changed
- change all method names to full names (element, component, fragment, text, comment)
- list signature changed to (component|factory, dataKey)
