var dom = require('dom-document'),
		decorate = require('./decorate'),
		setChildren = require('./set-children'),
		namespaces = require('./namespaces'),
		is = require('./is')

module.exports = create

function create(cfg, arg) {
	var el = getElement(cfg)
	decorate(el, cfg)
	if (cfg.content) setChildren(el, cfg.content)
	return arg ? decorate(el, arg) : el
}
function getElement(cfg) {
	if (is.node(cfg.element)) return cfg.element.cloneNode(true)
	if (is.function(cfg.element)) return cfg.element()
	var xmlns = cfg.xmlns || namespaces[cfg.prefix],
			doc = dom.document,
			tag = cfg.tag || 'div'
	return xmlns ? doc.createElementNS(xmlns, tag) : doc.createElement(tag)
}
