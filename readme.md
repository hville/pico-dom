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

co('table', [
  el('caption', 'data-matrix')
  co('tbody',
    li('tr',
      co('td', el.svg('svg', svgIcon)),
      li('td', {
        ondata: function(val, pos) { this.el.textContent = val }
      })
    )
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
* factories with preset defaults to facilitate the creation of components
* All ES5 and HTML5 to avoid transpiling and facilitate compatibility
* no virtual DOM, all operations are done on actual nodes

## Limitations

* still in early trial phase. proof of concept only
* currently only available as a common JS module (i.e. `require('pico-dom')`)


## API

* Three types of *hyperscript* function
  * `el`: to generate HTML or Namespaced Elements
  * `co`: to generate components with custom behavious and lifecycle events
  * `li`: to generate a list of components derived from an array of values

* each *hyperscript* function has 2 additional properties:
  * `.preset` to create a new function with preset defaults. (e.g `el.svg = el.preset({xmlns: ns.svg})`)
  * `.svg` same *hyperscript* function with the svg namespace preset

* Additional exposed objects
  * `text`: to generate a text node
  * `ns`: configurable namspaces (`html` and `svg` already defined)
  * `global`: configurable global object to set the `document` object in any environment

Functions    | Type                                      | Notes
:--------    | :---                                      | :----
`.el`        | `(selector[, ...elConfig])` => `Factory`  | `el('p', {style: {color:'blue'}}, '1'))`
`.co`        | `(selector[, ...coConfig])` => `Factory`  | `co('p', {ondata: setText}))`
`.li`        | `(selector[, ...liConfig])` => `Factory`  | `li('li', {ondata: setIndex}))`
only the selector is required, remaining arguments can be in any order

Exposed      | Type                                      | Notes
:--------    | :---                                      | :----
`.text`      | `string` => `TextNode`                    | `var textNode = text('mytext')`
`.ns`        | `Object {prefix: namespace}`              | `{svg : 'http://www.w3.org/2000/svg'}`
`.global`    | `Object {document, Node, window}`         | eg. `global.document = jsdom.jsdom()`

Other Types  | Type                                      | Notes
:--------    | :---                                      | :----
`selector`   | `string`, `factory` or `Node`             | `svg:circle[style=font-size:150%;color:blue]`
`elConfig`   | `elDecorator` or `contentItem`            |
`elDecorator`| `Object` {attrs, props, style, xmlns}     | element's attributes, properties and style
`contentItem`| `Factory`, `string`, `Node` or `Array`    | element child Nodes
`Factory`    | `elConfig` => `Node`                      | `elFactory({props: {tabIndex:2}})`
`coConfig`   | `coDecorator` or `contentItem`            |
`coDecorator`| `elDecorator`, `lifecycleFn`              | `{ondata: setIndex, style: {color:'blue'}}`
`lifecycleFn`| `Object` {oninit, ondata, onmove}         |
`liConfig`   | `liDecorator` or `contentItem`            |
`liDecorator`| `coDecorator`, `dataKey`                  | `{dataKey: 'uid'}`


## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
