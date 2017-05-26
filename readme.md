<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 MD036 -->

# pico-dom

*minimalist tool for dynamic DOM tree and component creation, updates, events and lifecycles functions. Supports svg, namespace, keyed lists, and conditional elements, all in under 2kb gzip, ES5, no dependencies. Support direct use in browser, CJS and ES modules*

• [Example](#example) • [Why](#why) • [API](#api) • [License](#license)

## Example

supports different environments
* CJS: `require('pico-dom').element`
  * can also be used server-side. See `setDocument` below
* ES modules: `import {element} from 'pico-dom'`
* browser: (`picoDOM.element`)*

```javascript
import {element as el, list} from '../module'
import {Store} from './Store' // any user store will do
import {ic_remove, ic_add} from './icons'


var tableTemplate = el('table',
  el('tbody',
    list(
      el('tr',
        {class: 'abc'},
        function(tr) { tr.common.i = tr.key },
        el('td', ic_remove, {
          on: {click: function() { this.common.store.delRow(this.common.i)}}
        }), // title column
        list( // data columns
          el('td',
            function(td) { td.common.j = td.key },
            el('input',
              function(c) { c.i = c.common.i; c.j = c.common.j },
              {
                update: function(val) { this.node.value = val },
                on: {
                  change: function() { this.common.store.set(this.node.value, [this.i, this.j]) }
                }
              }
            )
          )
        )
      )
    ),
    el('tr',
      el('td', ic_add, {
        on: {
          click: function() { this.common.store.addRow() }
        }
      })
    )
  )
)

var store = new Store([]),
    table = tableTemplate.create({common: {store: store}}).moveTo(document.body)
```

## Why

To explore ideas for a flexible and concise API with minimal tooling and memory footprint.


### Features

* dynamic lists and nested lists (keyed, indexed or select)
* svg and namespace support
* ability to inject a `document API` for server use and/or testing (e.g. `jsdom`)
* no virtual DOM, all operations are done on actual nodes
* less than 2 kb gzip, no dependencies
* all text injections and manipulations done through the secure `textContent` and `nodeValue` DOM API
* available in CommonJS, ES6 modules and browser versions
* All in ES5 with ES modules, CJS module and iife for browsers. Should work well on mobile and older browsers.


### Limitations

* proof of concept. more example and test required to validate the idea and API
* API still in flux
* view and event helpers only
* strictly DOM element creation and manipulation (no router, store, css utilities)


## API

This is just an overview. Details can be found in the source code (under 600 lines including comments and jsDocs).

### Templates

A template is an immutable set of instructions to generate multiple components.

Element templates
* `element(tagName [, ...options|children|transforms])`
* `elementNS(nsURI, tagName [, ...options|children|transforms])`
* `svg(tagName [, ...options|children|transforms])`

Node template
* `text(textContent [, ...options|transforms])`
* `template(node, [, ...options|transforms])`

List template
* `list(template, [, ...options|transforms])`


The 6 template generating functions take the following types of arguments:

* **options**: Object to define future operations `{methodName: arguments}` upon component creation. Examples
  * `{call: function() { this.update = this.text }}` to perform component operations
  * `{class: 'abc'}` to set the component node class attribute once an element component is created
  * `{attrs: {id: 'abc'}}` to set component node attributes once an element component is created
  * `{events: {click: function() { this.text('CLICKED!') } }}` to set element component event listeners
  * `{props: {id: 'abc'}}` to set component node properties
  * `{extras: {someKey: someValue}}` to set component properties on the component itself
  * `{append: ['a', 0]}` to explicitly append children instead of just listing them in the fatory function

* **transforms** are just functions called with the component context. Same as using the `{call: function}` option

* **children** can be templates, nodes or numbers and strings to be converted to text nodes. Same as using the `{append: [...]}` option

Templates have a number of chainable methods that generate new templates (templates are immutable). The methods are the same as the option keys listed above with additional methods that take more than one argument.
* element attributes: `.attr(key, val)`, `.attrs({key, val})`
* element children: `.append(node, number, string, template)`
* element event listeners: `.event(name, callback)`, `.events({name, callback})`
* node properties: `.prop(key, val)`, `.props({key, val})`
* component properties: `.extra(key, val)`, `.extras({key, val})`
* component operations: `.call(funtion() {})`


### List

List are special components representing a group of multiple nodes.

Resizable lists take a single template that will be used to generate list of varying sizes
* `list(template)` to create dynamic indexed set of nodes based on the size of the array upon updates
* `list(template, {getKey: function(v) {return v.id}})` for a keyed list

Select lists have predefined templates that are used to conditionally display subsets on updates
* `list({a: templateA, b:templateB}, {select: function(v) {return [v.id]}})` created a conditional list template

lists can be stacked and nested.


### Components

Components are created from templates: `template.create()`.
Normally, only the main component is manually created and all other templates are initiated from within.

In addition to the same methods found in templates (`attr(s)`, `props(s)`, `extra(s)`, `call`, `append`, `class`, `event`, `events`), Components have the following properties and methods for dealing with DOM Nodes

#### DOM references

* `.node`: the associated DOM node or anchor node for lists
* `.root`: the root component that created the component. (`null` for the main one created by the user)

#### DOM functions

* `.moveTo(parent [,before])`: to move a component
* `.remove()`: to remove a component from the DOM
* `.destroy()`: to remove a component and remove listeners

#### Update Functions

* `.text(v)`: to set the node textContent of element Component
* `.value(v)`: to set the node value of element Component
* `.update(...)` the function to trigger changes based on external data
* `.updateChildren(..)` to pass update data down the tree.

By default, update is set to `value` for input elements, `text` for text components and `updateChildren` for the rest.
Normally, only the main component is updated and the update trickles down the DOM tree according the the rules predefined in the templates.

#### Other

* `.key` key for identification and sorting. Set by parent lists on componet children
* `.refs`: used in list to hold node references
* `.getKey(val, key, arr) => string`: to get the unique key for keyed lists
* `.select(val, key) => array`: array of keys for conditional/select lists

#### Lifecycle operations

Lifecycle hooks and async operations can be done by wrapping component default methods

* on creation: `template.call(...)`
* on insert: `template.call(...)` or wrap `component.moveTo(...)`
* on remove: wrap `component.remove()`
* on destroy: wrap `component.destroy()`

```javascript
var textTemplate = text('ABC', function() {
  var remove = this.remove
  this.remove = function() {
    window.requestAnimationFrame(remove)
  }
})
```


### Other helpers
* `setDocument(document)` to set the Document interface for testing or server use
  * eg. `setDocument((new JSDOM).window.document)`
* `D` reference to the Document interface for testing or server use
  * eg. `var body = D.body`
* `find(from [, test] [, until])` find a component within nodes or components and matching the test function. It parses nodes up and down following the html markup order.
  * eg. `find(document.body)` to get the first component in the document
  * eg. `find(tableComponent, function(c) { return c.key === 5 } )`


## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
