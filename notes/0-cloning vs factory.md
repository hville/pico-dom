# cloning vs factory

Takeaway: factory

* hide constructors under the hood
* cloning can have issues
  * Element forms and listeners
  * mismatch between element and component children
  * unclear if element is meant to be moved or cloned

## Exports

* instance: `instance = exports.clone(options)` or `instance = exports.cloneNode(true)`
  * cloning required
* factory: `instance = factory(options)`
  * simple
* Constructor: instance = new Constructor(options)
  * no prototypes (events)

## Element

Takeaway: both acceptable, *element* looks simpler

* returns element:
  * `el1 = el(el0.cloneNode(false), cfg, el0.childNodes)`
  * `el1 = el(el0.cloneNode(true), cfg)`
  * `this.namedElement = el('div')`
  * co(el0, el1) => factory => every element created always gets cloned
* returns factory:
  * `el1 = el(el0(), cfg)`
  * `el1 = el0(cfg)`
  * `this.namedElement = el('div')()`
  * element created once

## Component

* cloning:
  * module.exports = Constructor || component
  * `this.el = co0.el.cloneNode(false)` children will be overwriten
  * this.on* ==> co0.on*
  * **named||custom attributes are lost**
  * children:
    * Element => Element.cloneNode(true)
    * Component => Component.clone()
* factory:
  * `el1 = el(el0(), cfg)`
  * `el1 = el0(cfg)`
  * `this.namedElement = el('div')()`
