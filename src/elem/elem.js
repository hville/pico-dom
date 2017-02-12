var factory = require('../util/create-factory'),
		getElement = require('./get-element')

var el = factory(getElement)
el.svg = factory(getElement, {xmlns: 'http://www.w3.org/2000/svg'})

module.exports = el
