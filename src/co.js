import creator from './util/creator'
import decorate from './decorate'
import ns from './namespaces'
import Component from './component'

var preset = creator(function(elm, cfg, cnt) {
	return new Component(decorate(elm, cfg, cnt), cfg.extra, cfg.input)
})

var co = preset()
co.svg = preset({xmlns: ns.svg})
co.preset = preset

export default co
