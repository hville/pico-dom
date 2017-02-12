Differences with redom
======================

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
      li('td', {edit: function(val, pos) { this.el.textContent = val }})
    )
  ),
])
```

output        PICODOM                                 REDOM
HTML          el('h1', {style:{color:'red' }}, 'H')   el('h1', {style:{color:'red' }}, 'H')
SVG           el.svg('circle')                        svg('circle')
Component     co('div')                               custom class {el, update}
List          li('tr', co('td'), li('td'))            list('tr', Li)
Router        -NA-                                    YES
List          ANY                                     UNIFORM
?             EventHandler



* selector
  * TODO
* options
  * TODO
  * rawElement: `.xmlns`, `.prefix`, `.tag`
  * ??????????: `.element`
  * decorated: rawElement + `.dataset`, `.attributes|.attrs`, `.properties|.props`, `.style`
  * component: decorated & `.content`, `.key`, `.edit`, `.on`, `.init`
  * list: component & `.datakey`
* children
  * TODO
* content
  * TODO

```javascript
li('tr', {
  datakey: 'id',
  on: {click: clickHandler},
  props: {onchange: changeHandler},
  style:{color:'red' },
  edit: function() {},
  init: function(cfg) {}
}, el('td', 'txt'))
```
