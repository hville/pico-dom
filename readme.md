<!-- markdownlint-disable MD004 MD007 MD010 MD041 MD022 MD024 MD032 -->

# pico-dom

*minimalist hyperscript-based DOM tree **element**, **component** and **list** functions with svg, namespace and W3 selector support*

• [Example](#example) • [Features](#features) • [API](#api) • [License](#license)

## Example

```javascript
var pico = require('pico-dom)
var co = pico.co,
    li = pico.li,
    el = pico.el

co('table', {}, [
  el('caption', 'data-matrix)
  co('tbody', {},
    li('tr', {}, [
      co('td', {},
        el.svg('svg', svgIcon)
      ),
      li('td', {
        edit: function(val, pos) { this.el.textContent = val }
      })
    ])
  ),
])
```

## Features

* dynamic list and nested lists
* namespaced tag and namespaced attribute support
* svg namespace and utility functions pre-defined
* w3 string selector API, including attributes
* element decorators for element properties and attributes
* ability to inject a `document API` for server and/or testing (e.g. `jsdom`)
* ability to create an element or an element factory
* ability to create additional namespaces and utility namespaced functions

## API

* Main *hyperscript* function
  * `el(selector[, option][, children])` => `HTMLElement`
  * `co(selector[, option][, content])` => `HTMLComponentFactory`
  * `li(selector[, option][, content])` => `HTMLListFactory`
* Intermediate partial functions
  * `HTMLComponentFactory([options])` => `HTMLViewFunction`
  * `HTMLListFactory([options])` => `HTMLViewFunction`
  * `HTMLViewFunction` => `HTMLElement`

SVG elements, components and lists can be created with the above functions with an `xmlns` attribute
or by using the following preset functions:

* `el.svg(selector[, option][, children])` => `SVGElement`
* `co.svg(selector[, option][, content])` => `SVGComponentFactory`
* `li.svg(selector[, option][, content])` => `SVGListFactory`

### Optional additional utilities

* `CO.global.document` injects an external document API like `jsdom`. Uses the global `document` if not specified.
* `CO.namespaces` adds additional namespace prefix (svg is already defined). E.g. `CO.namespaces.xlink: 'http://www.w3.org/1999/xlink'`
* `CO.decorators` to add element decorators E.g. `CO.decorators.a = CO.decorators.attributes`
* `CO.Co` to create a custom `co` function E.g. `coTable = Co({init: createSharedContext})`
* `CO.Li` to create a custom `li` function E.g. `liSVG = Li({xmlns: 'http://www.w3.org/2000/svg'})`

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
