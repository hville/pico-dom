var ct = require('cotest')

var Config = require('../src/util/config')

ct('config', function() {
	function noop(){}
	var cfg0 = new Config({tag: 'a', key:'a', attrs:{}, props:{id:'a'}, oninit:noop}),
			cfg1 = new Config(cfg0)
	ct('!==', cfg0, cfg1)
	ct('{==}', cfg0, cfg1)
	cfg1.tag = 'b'
	cfg1.attrs.id = 'b'
	cfg1.props.id = 'b'
	ct('!{==}', cfg0.attrs, cfg1.attrs)
	ct('!{==}', cfg0.props, cfg1.props)
})
