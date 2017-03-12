var ns = require('./src/util/namespaces'),
		el = require('./src/el'),
		co = require('./src/co'),
		li = require('./src/li'),
		ENV = require('./src/env')

ENV.el = el
ENV.co = co
ENV.li = li
ENV.ns = ns

module.exports = ENV
