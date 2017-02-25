<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 -->

# pico-dom

*minimalist hyperscript-based DOM tree **element**, **component** and **list** functions with svg, namespace and W3 selector support*

• [Example](#example) • [Features](#features) • [API](#api) • [License](#license)

## Example

```javascript
var pico = require('pico-dom')
var co = pico.co,
    li = pico.li,
    el = pico.el

var table = co('table', [
  el('caption', 'data-matrix')
  co('tbody',
    li('tr',
      co('td', el.svg('svg', svgIcon)),
      li('td', {
        co('input', {ondata: function(val, pos) { this.node.value = val }}
      })
    )
  ),
])
table.update([['Jane', 'Roe'], ['John', 'Doe']])
table.moveto(document.body)
```

## Features

* dynamic list and nested lists
* namespaced tag and namespaced attribute support
* svg namespace and utility functions pre-defined
* w3 string selector API, including attributes
* element decorators for element properties and attributes
* ability to inject a `document API` for server and/or testing (e.g. `jsdom`)
* factories with preset defaults to facilitate the creation of components
* All ES5 and HTML5 to avoid transpiling and facilitate compatibility
* no virtual DOM, all operations are done on actual nodes
* under 3kb gzip, no dependencies

### Limitations

* still in early trial phase. proof of concept only
* currently only available as a common JS module (i.e. `require('pico-dom')`)

### Inspiration

Some ideas taken from `snabbdom` (configurable decorators), `redom` (no virtual dom, lists) and `mithril`.


## API

### Hyperscript Functions

Three types of *hyperscript* function
* `el`: to generate HTML or Namespaced Elements
* `co`: to generate components with custom behavious and lifecycle events
* `li`: to generate a list of components derived from an array of values

Functions    | Type                                       | Example
:--------    | :---                                       | :----
`.el`        | `(selector[, ...elConfig])` => `Element`   | `el('p', {style: {color:'blue'}}, '1'))`
`.co`        | `(selector[, ...coConfig])` => `Component` | `co('p', {ondata: setText}))`
`.li`        | `(selector[, ...liConfig])` => `List`      | `li('li', {ondata: setIndex}))`
only the selector is required, remaining arguments can be in any order

each *hyperscript* function has 2 additional properties:
* `.preset` to create a new function with preset defaults. (e.g `el.svg = el.preset({xmlns: ns.svg})`)
* `.svg` same *hyperscript* function with the svg namespace preset

for example, the following are equivalent:
* `el.svg('circle')` (Internally, `el.svg = el.preset({xmlns: ns.svg})`)
* `el('svg:circle')`
* `el('circle', {xmlns: ns.svg})`
* `el.preset({xmlns: ns.svg})('circle')`
* the same logic applies for `co` and `li` (`co.svg`, `li.preset`, ...)


#### Element Factory

* `var element = el(selector[, ...options][, ...children])`
* element is a normal `DOM Element`

arguments  | Type                                    | Example
:--------  | :---                                    | :----
`selector` | `string`, `factory` or `Node`           | `svg:circle[style=font-size:150%;color:blue]`
`options`  | `Object` {attrs, props, style, xmlns}   | element's attributes, properties and style
`.attrs`   | `Object` ...any key-value pair          | `{id: 'myID'}`
`.props`   | `Object` ...any key-value pair          | `{tabIndex: 2}`
`.xmlns`   | `Object` ...any key-value pair          | `{xmlns: ns.svg}`
`.style`   | `Object|String` string of key-values    | `{color:'blue'}` or `font-size:150%;color:blue`
`children` | `factory`, `string`, `Node` or `Array`  | element child Nodes, Components of Lists


#### Component Factory

* `var component = co(selector[, ...options][, ...children])`
* a component as an element and associated behaviours
  * `.node` the associated node
  * `.update(...)` the function to trigger changes based on external data
  * `.moveto(parentNode|null[, before])` to move the component.
  * `.updateChildren(..)` to pass down data down the tree. By default, all new components have `ondata` property set to `updateChildren`. If `ondata` is specified, children must be manually notified.

arguments    | Type                                      | Example
:--------    | :---                                      | :----
`selector`   | `string`, `factory` or `Node`             | same as for `el()`
`options`    | `Object` {...lifecycle, on}               | same as for `el()` with additional options
`.oninit`    | `options => void`                         | `function() { this.moveto(document.body) }`
`.ondata`    | `(...any) => element`                     | `function(v) { this.node.textContent = v }`
`.onmove`    | `(oldParent, newParent) => element`       | `function(o,n) { if (!n) console.log('dismounted') }`
`.on`        | `Object` ...any key-value pair            | `{click: function() { this.node.textContent = 'clicked' }}`

#### List Factory

* `var list = co(selector[, ...options][, ...children])`
* a list is just a component that gets repeated on update to match a given array of values
* `list.update(array)` triggers multiple components `component.update(value, index, array`
* lists can be nested or stacked
  * nested: `co('body', li('tr', li('td', {ondata: function(v) { td.textContent = v }})))`
  * stacked: `co('tr', li('td', cellType1), li('td', cellType2))`
* list takes on additional `dataKey` option (eg. `{dataKey: 'uid'}`)
  * if omitted, list items are never swapped but just updated with the new value
  * if a `string` or a `function` is provided list items will be swapped to match the new data ordering
    * string example: `{dataKey: 'uid'}`
    * funtion example: `{dataKey: function(v,i) { return v.uid }}`

### Additional utilities

* `text`: to generate a text node
* `ns`: configurable namspaces. `html` and `svg` are already defined, others can be added
* `setWindow`: configurable global environment to facilitate testing or server generation

Utility      | Type                                      | Example
:--------    | :---                                      | :----
`.text`      | `string` => `TextNode`                    | `var textNode = text('mytext')`
`.ns`        | `Object {prefix: namespace}`              | `ns.svg = 'http://www.w3.org/2000/svg'}`
`.setWindow` | `window` => `void`                        | eg. `setWindow(jsdom.jsdom().defaultView)`


## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
