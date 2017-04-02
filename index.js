var ENV = require('./src/env')

ENV.element = require('./src/el')
ENV.component = require('./src/co')
ENV.list = require('./src/list')
ENV.text = require('./src/text')
ENV.comment = require('./src/comment')
ENV.fragment = require('./src/fragment')
ENV.namespaces = require('./src/namespaces')

module.exports = ENV
