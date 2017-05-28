import {D, css, element as el, list} from '../module'

css('.transitionEx { opacity: 0.5; transition: all 1s ease; }')
css('.transitionIn { opacity: 1.0; transition: all 1s ease; }')

var optionValues = {
	templates: 'immutable template',
	lists: 'select list',
	components: 'dynamic components',
	css: 'css rule insertion',
	transitions: 'css transitions',
	async: 'async operations',
	events: 'event listeners setting and removal'
}

var optionKeys = Object.keys(optionValues)


var select = el('select',
	list( optionKeys.map(function(k) {
		return el('option', {attr: 'selected'}, k)
	}))
)
.attr('multiple')
.attr('size', optionKeys.length)


var item = el('li',
	function() {
		var comp = this,
				moveTo = comp.moveTo,
				destroy = comp.destroy

		this.class('transitionEx pl5 light-blue')

		// on insert, async change of the class to trigger transition
		this.moveTo = function(parent, before) {
			if (!this.node.parentNode) D.defaultView.requestAnimationFrame(function() {
				comp.class('transitionIn pl1 dark-blue' )
			})
			return moveTo.call(this, parent, before)
		}

		// on remove, change the class and wait for transition end before removing
		this.destroy = function() {
			this.event('transitionend', function() {
				this.event('transitionend') //remove the listener
				destroy.call(comp)
			})
			if (this.node.parentNode) D.defaultView.requestAnimationFrame(function() {
				comp.class('transitionEx pl5 light-blue')
			})
			return this
		}
		this.update = this.text
	}
)


el('div',
	el('h2', {class: 'pl3'}, 'example with'),
	el('div', {class: ''},
		el('div', {class: 'fl w-25 pa3'},
			select.class('v-top').call(function() {
				this.root.refs.select = this
				this.event('change', function() { this.root.update() })
			})
		),
		el('div', {class: 'fl w-25 pa3'},
			el('ol', {class: 'v-top'},
				list(
					item
				).extra('update', function() {
					var opts = this.root.refs.select.node.options,
							keys = []
					for (var i=0; i<opts.length; ++i) if (opts.item(i).selected) keys.push(opts.item(i).textContent)
					this.updateChildren(keys)
				}).extra('getKey', function(v) { return v })
			)
		),
		el('div', {class: 'fl w-50 pa3'})
	)
).create().update().moveTo(D.body)
