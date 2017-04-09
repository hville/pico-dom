<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 -->

# pico-dom

*minimalist hyperscript-based DOM tree **element**, **component** and **list** functions with svg, namespace and W3 selector support, all in 2kb gzip, no dependencies*

• [Example](#example) • [Features](#features) • [API](#api) • [License](#license)

## Example

```javascript
var pico = require('pico-dom')
var el = pico.element,
    co = pico.component,
    list = pico.list

var table = co('table', [
  el('caption', 'data-matrix'),
  co('tbody',
    list(co('tr',
      co('td', el.svg('svg', svgIcon)), // title column
      list(co('td',
        co('input', {
          extra: {
            update: function(val, pos) { this.node.value = val }
          }
        })
      ))
      co('td', el.svg('svg', svgIcon)), // summary column
    ))
  )
])
table.update([['Jane', 'Roe'], ['John', 'Doe']])
el(document.body, table)
```

## Features

* dynamic lists and nested lists
* namespaced tag and namespaced attribute support
* svg namespace and utility functions pre-defined
* w3 string selector API, including attributes
* element decorators for element properties and attributes
* ability to inject a `document API` for server and/or testing (e.g. `jsdom`)
* no virtual DOM, all operations are done on actual nodes
* around 2.3kb gzip, no dependencies
* all text injections and manipulations done through the secure `textContent` and `nodeValue` DOM API
* available in CommonJS, ES6 modules and browser versions

### Limitations

* All in ES5 with a bare-bone WeakMaps get/set replacement for browsers below IE11 and Android 5.0. Should work on all browsers but not tested.

### Inspiration and Design Goals

* strictly DOM element creation and manipulation (no router or store)
* minimal intermediate object. Structure is held by the DOM itself
* minimal memory profile for mobile use

## API

### Elements

Typical hyperscript API `element(selector[, ...configurations][, ...children])` to generate HTMLElements, SVGElements or other namespaced Elements

example: `pico.element('p', {attrs: {style: 'color:blue'}}, '1'))`

If an Element is provided as a selector, it is simply decorated as-is with additional attributes, properties and/or children.

Only the selector is required, remaining arguments can be in any order. Objects are grouped to apply configurations, all other argument types are added to the children list
* Object `options` {attrs, props, xmlns}
  * xmlns: custom namespace for new elements
  * props & attrs: key:val pairs to add attributes and properties to a new or existing element
* String|Node|Array|Component|List `children`
  * adds children to the new or existing element

The function has 2 additional properties:
* `.preset` to create a new function with preset defaults
  * example: `createSpecial = element.preset({xmlns: specialNamespace})`
* `.svg` same *hyperscript* function with the svg namespace preset
  * internaly: `element.svg = element.preset({xmlns: ns.svg})`

#### Component Factory

A component is just an additional context tied to an element (via WeakMap) to attach additional properties, methods and lifecycle events. The component hyperscript works the same way as the element function (`component(selector[, ...configurations][, ...children])`). The component context is defined with the additional `extra` decorator.

```javascript
co('button[type=button].btn#fire', {
  props: {
    onclick: clickHandler
  },
  extra: {
    update: function(val) { this.node.textContent = val }
  }
}
```

A component has the following properties and methods:
* `.node` the associated node
* `.update(...) => this` the function to trigger changes based on external data
* `.moveTo(parentNode|null[, before])` to move|mount|unmount the component
* `.setText(text)` helper efficiently and safely change the node text
* `.updateChildren(..)` to pass down data down the tree. By default, all new components have `update` property set to `updateChildren`. If `update` is specified, children updates must be manually called.
* `.clone([cfg]) => new instance` to clone a component and underlying tree with optional additional configuration
* `.key` optional key for identification or list sorting

Lifecycle functions
* `.init()` on object creation
* `.update(...any)` when new data is available
* `.onmove(oldParent, newParent)` when the component is moved or removed


### DOM helpers
* `text(string)` => TextNode
* `comment(string)` => commentNodes
* `fragment()` => documentFragment


#### Lists

`list(component|componentFactory, dataKey)`

A list is a component or component factory that gets repeated on update to match a given array of values.

* `.header` the associated positionning header commentNode
* `.header` the associated positionning footer commentNode
* `.update(array) => this` triggers multiple components `component.update(value, index, array)`
* `.moveTo(parentNode|null[, before])` to move the list and all content
* `.removeChildren([after])`
* `.clone() => new instance`

* lists can be nested or stacked
* list takes on additional `dataKey` argument
  * if omitted, list items are never swapped but just updated with the new value
  * if a `string` or a `function` is provided list items will be swapped to match the new data ordering
    * string example: `list(myfactory, 'uid')`
    * funtion example: `list(myfactory, function(v,i) { return v.uid })`

### Namespaces

SVG and/or other namespaces are supported. For example, the following are equivalent:

* `el.svg('circle')` (Internally, `el.svg = el.preset({xmlns: ns.svg})`)
* `el('svg:circle')`
* `el('circle', {xmlns: ns.svg})`
* `el.preset({xmlns: ns.svg})('circle')`
* the same logic applies for `component` (`co.svg`, ...)


### testing and configuration helpers
* `namespaces`: Configurable prefix-URL Object of namespaces. Defaults to `html` and `svg`
  * example `namespaces.svg = 'http://www.w3.org/2000/svg'}`
* `window`: Getter-Setter to optionally set a custom `window` object for testing or server use
  * example `pico.window = jsdom.jsdom().defaultView`

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
