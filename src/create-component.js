import {creator} from './util/creator'
import {decorate} from './decorate'
import {namespaces} from './namespaces'
import {Component} from './constructors/component'

/**
* @function preset
* @param  {Object} defaults preloaded component defaults
* @return {Function(string|Object, ...*):!Component} component hyperscript function
*/
var preset = creator(function(elm, cfg, cnt) {
	return new Component(decorate(elm, cfg, cnt), cfg.extra, cfg.input)
})

export var createComponent = preset()
createComponent.svg = preset({xmlns: namespaces.svg})
createComponent.preset = preset
