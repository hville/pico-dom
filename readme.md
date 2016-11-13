<!-- markdownlint-disable MD004 MD007 MD010 MD041 MD022 MD024 MD032 -->

# pico-dom
minimalist hyperscript-based DOM tree functions

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


## example

```javascript
co('table', {}, [
  co('thead', {}, [
    co('tr', {}, [
      li('th', {
        edit: function(data, pos) { this.el.textContent = pos }
      })
    ])
  ]),
  co('tbody', {}, [
    li('tr', {}, [
      co('td', {}, [
        co.svg('svg', {})
        co('input', {props: {type: 'checkbox'}})
      ]),
      li('td', {}),
      co('td', {})
    ])
  ]),
])
```

## TODO
transform data
