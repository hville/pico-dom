<!-- markdownlint-disable MD022 MD024 MD026 MD032 MD041 -->

# Change Log

- based on [Keep a Changelog](http://keepachangelog.com/)
- adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
~~Removed, Changed, Deprecated, Added, Fixed, Security~~
- list.factory({key: key}); Component(node, cfg0, cfg1, ...); this.init()
- list.factory(k, i); Component(node, cfg, k, i); this.init(k, i)
~~list(Element)~~
~~findNode( node => Bool, thisArg)=>node; findExtra( extra => Bool, thisArg)=>extra~~


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
- component option `ondata` changed to `update`
- component option `oninit` changed to `init`
- Internal list component to key reference (property instead of weakmap)
- Removed the custom component decorators

## [0.14.0] - 2017-03-28
### Changed
- removed the list fragment magic. list must now be manually mounted before update

### Added
- `list.clear([after])`
- `list.moveto(null)` and `component.moveto(null)`
- `fragment()` => documentFragment

## [0.13.0] - 2017-03-28
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
