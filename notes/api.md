# API

<!-- markdownlint-disable MD022 MD032 -->

## ELEMENT

takeaway:
* `el(string, {attrs,props,xmlns}, elements|factories)`
* TODO: disallow other types
* TODO: let el do the cfg merging

* normal: `el(sel, {attrs,props,xmlns}, elements)`
* maybe: `el(sel, {attrs,props,xmlns}, elFactories)` for exported elements
* ugly: `el(element|elFactory, {attrs,props,xmlns}, element.childNodes)` for exported elements
  * unclear if append or replace children
* `exports = cfg => el('div', def, cfg, content)`

## OTHER NODES

* Normal: `text(string)`, magic: `el('#', text)`
* Maybe: `comment(comment)`, magic `el('!', comment)`

## COMPONENT

## NANOCOMPONENTS

`nc({render, onupdate})(...args) => Element`




Changes
* el => Element
* manual update
* co => instance

BEFORE
`el(sel, cfg, cnt)(opt)` => `HTML`
`el.svg(sel, cfg, cnt)(opt)` => `svg`
cfg: `{attrs, props}`

AFTER
`el(sel, cfg, cnt)` => `HTML`
`el.svg(sel, cfg, cnt)` => `SVG`
cfg: **???**
* just decorate with `el(refEL, cfg, cnt)` => `newEL`

BEFORE
`co(sel, cfg, cnt)(opt)(val, idx)` => `HTML`
`co.svg(sel, cfg, cnt)(opt)(val, idx)` => `svg`
cfg: `{on, ondata, oninit, key, datakey, attrs, props}`

AFTER-A
`co(el(sel, att), cfg, cnt).update(val, idx)` => `HTML`
`co(co(sel, att, cnt), cfg, cnt).update(val, idx)` => `HTML`
* split el and component options
* components are exposed and can be cloned
* mixing props and attrs is tricky

AFTER-B
`co(sel, cfg, cnt)(val, idx)` => `HTML`
`co(el(sel, att), cfg, cnt)(val, idx)` => `HTML`
`co(co(sel, att, cnt), cfg, cnt)(val, idx)` => `HTML`
* flexible
* need a handle on the function to access component `this.view.component`


```javascript
co('tbody',
  li('tr',
    co('td', el.svg('svg', svgIcon)),
    li('td', {edit: function(val, pos) { this.el.textContent = val }})
  )
)
```

```javascript
co(el('tbody'),
  li('tr',
    co('td', el.svg('svg', svgIcon)),
    li('td', {edit: function(val, pos) { this.el.textContent = val }})
  )
)
```




```javascript
//custom creators for shared scope
var li = pico.Li(defaults)
var tableCo = co('table', [
  el('caption', 'data-matrix')
  co('tbody',
    li('tr',
      co('td', el.svg('svg', svgIcon)),
      li('td', {edit: function(val, pos) { this.el.textContent = val }})
    )
  ),
])
var tableFn = tableCo(options)
var tableEl = tableFn(data)
document.body.appendChild(tableEl)
```







Takeway:

* element: (+ns)
  * instance = el(txt|efn|elm, cfg, ... txt|elm|efn|cfn|childNodes)
* component: (+ns)
  * instance = Component(elm, cfg, [txt|elm|efn|cfn|childNodes])
  * factory = co(txt|efn, cfg, ... txt|elm|efn|cfn|childNodes)
  * ps: `.element`, `.children`, `.key`
  * ms: `.ondata()`(user|default)
  * note: user-update must manually update children
* fragment:
  * instance = Fragment([elm|coi|fri|lii], cfg)
  * factory = fr([txt|elm|efn|cfn|childNodes]..., cfg)
  * ps: `.content`, `.header`, `.key`
  * ms: `.ondata()`(user|default), `moveTo(parent, before)`
  * note:
* list: (factory, options)
  * instance = List(factory, cfg)
  * factory = li(elm, cfg, [txt|elm|efn|cfn|childNodes])
  * ps: `.content`, `.header`, `.factory`, `.dataKey()`, `.key`
  * ms: `.ondata()`
  * note: just a group with a custom update function
* config: {attrs, props, style, oninit, ondata, on, key, dataKey}
* text(text) => element

## instance vs function

* instance
  * ? ugly `myco().ondata()`
  * `document.body.appendChild(myco().el)`
  * component: access to element
  * fragment: access to methods
* view function:
  * nice `document.body.appendChild(myco()(data))`
  * need custom function closure with custom function properties ()
