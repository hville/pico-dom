<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 MD036 -->

# pico-dom

*minimalist hyperscript-based DOM tree **dynamic component** functions with svg, namespace and list support, all in 2kb gzip, no dependencies. Support direct use in browser, CJS and ES modules*

• [Example](#example) • [Why](#why) • [API](#api) • [License](#license)

## Example

*supports CJS (`require('pico-dom').x`), ES modules (`import {x} from 'pico-dom'`) and browser use (`picoDOM.x`)*

```javascript
import {element as el, list} from 'pico-dom'
import {Store} from 'myStore' // any user store will do

var table = co('table', {
  update: function() {
    this.updateChildren(this.store.get())
  }},
  el('caption', 'data-matrix'),
  co('tbody',
    list(
      el('tr',
        {class: 'abc'},
        function(tr) { this.state.i = this.key },
        el('td', el.svg('svg', svgIcon)), // title column
        list( // data columns
          el('td',
            function(td) { this.state.j = this.key },
            '$ ',
            el('input', {
              function(input) {
                this.i = this.state.i,
                this.j = this.state.j
              },
              update: function(val) {
                this.node.value = val
              },
              on: {change: function() {
                this.store.dispatch('set', [this.i, this.j, this.node.value])
              }}
            })
          )
        )
      )
    )
  )
)

var store = new Store([['Jane', 'Roe'], ['John', 'Doe']])

table.create({store: store})
.update()
.moveTo(document.body)
```

## Why

To explore ideas for a flexible and concise API with minimal memory footprint.


### Features

* dynamic lists and nested lists (keyed, indexed or select)
* svg and namespace support
* ability to inject a `document API` for server and/or testing (e.g. `jsdom`)
* no virtual DOM, all operations are done on actual nodes
* around 2.0 kb gzip, no dependencies
* all text injections and manipulations done through the secure `textContent` and `nodeValue` DOM API
* available in CommonJS, ES6 modules and browser versions
* All in ES5 with ES modules, CJS module and iife for browsers. Should work on mobile and old browsers (not tested).


### Limitations

* proof of concept. more example and test required to validate the idea and API.
* view and event helpers only
* strictly DOM element creation and manipulation (no router or store)


## API Overview

This is just an overview. Details can be found in the source code (under 600 lines including comments and jsDocs).

### component Templates

Four functions (element, elementNS, svg and text) are available to generate component templates

* element: `(tagName [, ...options|children|transforms]) => template`
* elementNS: `(nsURI, tagName [, ...options|children|transforms]) => template`
* svg: `(tagName [, ...options|children|transforms]) => Template`
* text: `(textContent [, ...options|transforms]) => Template`

The 4 functions take the following types of arguments:

* options: Object to either assign a key value to the component once created or to run a component method once created
  * `{someKey: someValue}` assigns component.someKey = someValue. same as `{assign: {someKey: someValue}}`
  * `{class: 'abc'}` sets the node class once the element is created
  * `{defaults: {someKey: someValue}}` set component defaults before other operations are carried out

### list Templates

list: `(template|Object<template>|Array<template>, [, ...options|transforms]) => listTemplate`

* `list(template)` creates a dynamic list template
* `list(template, {getKey: function(v) {return v.id}})` created a dynamic keyed list template
* `list({a: templateA, b:templateB}, {select: function(v) {return [v.id]}})` created a conditional list template

lists can be nested.


### Components

Components are created from templates: `template.create([options])`

Node Components have the following properties and methods for dealing with DOM Nodes

* node: the associated DOM node
* text(v): to set the node textContent
* value(v): to set the node value
* attr(name, value): to set (`attr(name, value)` or `attr(name)`) or remove (`attr(name, false)`) attributes
* attrs({name: value}): same as attr but for multiple attributes
* prop(name, value): to set node properties
* props({name, value}): to set multiple node properties
* class(string): to set the node class

List and Node Components also have the following properties and methods for dynamic content:

* state: a object passed down to children for shared context within a component
* store: a user defined store object passed down to children.
* `.update(...) => this` the function to trigger changes based on external data
* `.moveTo(parentNode|null[, before])` to move|mount|unmount the component
* `.updateChildren(..)` to pass down data down the tree. By default, all new components have `update` property set to `updateChildren`. If `update` is specified, children updates must be manually called.
* `.key` optional key for identification or list sorting. Set by parent lists

Lifecycle function
* `.onmove(oldParent, newParent)` triggered just before a component is inserted `(null, target)` is moved `(origin, target)` or removed `(origin, null)`


### helpers
* `setDocument(document)` to set the Document interface for testing or server use
  * eg. `setDocument((new JSDOM).window.document)`
* `D` reference to the Document interface for testing or server use
  * eg. `var body = D.body`


## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
