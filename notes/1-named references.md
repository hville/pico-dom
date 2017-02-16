# named references

Takeaway: factory & oninit & queryselector are safe bets

## Constructor

```javascript
module.exports = function Custom(opt) {
  this.el = el('div',
    el('table',
      el('thead',
        el('tr',
          this.header = el('th', this.headerText)
        )
      ),
      this.body = new Body(opt)
    )
  )
}
Custom.prototype.update = function(v) {
  this.header.textContent = v
  this.body.update(v)
}
```

* smallest (319)
* flexible and simple
* no default prototypes (mounting, events)


## Factory function

```javascript
module.exports = function custom(opt) {
  var header = el('th', this.headerText),
      body = new Body(opt)
  var elem = el('div',
    el('table',
      el('thead',
        el('tr', header)
      ),
      body
    )
  )
  function ondata(v) {
    header.textContent = v
    body.update(v)
  }
  return co(elem, { ondata: ondata })(opt)
}
```

* 338, small


## Factory constructor

```javascript
var elem = el('div',
  el('table',
    el('thead',
      el('tr',
        el('th', '')
      )
    ),
    body
  )
)
function oninit() {
  this.header = this.el.querySelector('th')
  this.body = this.el.querySelector('tbody')
}
function ondata(v) {
  this.header.textContent = v
  this.body.update(v)
}
module.exports = co(elem.cloneNode(true), {oninit: oninit, ondata:ondata})
```

* 377
* optimized and clear
