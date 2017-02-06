var factory = require('create-element-ns/src/create-factory'),
		Component = require('./component'),
		getElement = require('create-element-ns/src/get-element'),
		ns = require('create-element-ns').namespaces.svg

function creator(Constructor) {
	return function (elm, cfg, cnt) {
		var instance = new Constructor(getElement(elm, cfg), cfg||{}, cnt)
		return function view(val, idx, after) {
			return instance.view(val, idx, after)
		}
	}
}

var getView = creator(Component)

function Co(def) {
	return factory(getView, def)
}

var co = Co()
co.svg = Co({xmlns: ns})

module.exports = {
	creator: creator,
	Co: Co,
	co: co
}
