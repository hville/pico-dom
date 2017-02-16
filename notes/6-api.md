# API

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

...
