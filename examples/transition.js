import {D, css, element as el, list} from '../module'

css('.transitionEx { opacity: 0.5; transition: all 2s ease; }')
css('.transitionIn { opacity: 1.0; transition: all 2s ease; }')

var options = {
	templates: 'immutable template',
	lists: 'select list',
	components: 'dynamic components',
	css: 'css rule insertion',
	transitions: 'css transitions',
	async: 'async operations',
	events: 'event listeners setting and removal'
}

var listItem = el('li',
	function() {
		var comp = this,
				moveTo = comp.moveTo,
				remove = comp.remove

		Object.defineProperty(this.parent, 'label', {
			get: function() { return comp.textContent },
			set: function(t) { comp.text(t) }
		})
		this.class('transitionEx pl5 light-blue')

		// on insert, async change of the class to trigger transition
		this.moveTo = function(parent, before) {
			if (!this.node.parent) D.defaultView.requestAnimationFrame(function() {
				comp.class('transitionIn pl1 dark-blue' )
			})
			return moveTo.call(this, parent, before)
		}

		// on remove, change the class and wait for transition end before removing
		this.remove = function() {
			this.event('transtionsend', function() {
				this.event('transitionend') //remove the listener
				remove.call(comp)
			})
			comp.class('transitionEx')
			return this
		}
	},
	'default initial textContent'
)


el('div',
	el('h2', {class: 'pl3'}, 'example with'),
	el('ol',
		list(
			Object.keys(options).reduce(function(res, key) {
				res[key] = listItem.extra('label', 'immutable template')
				return res
			}, {})
			[
			listItem.extra('label', 'immutable template'),
			listItem.extra('label', 'select list'),
			listItem.extra('label', 'components'),
			listItem.extra('label', 'css rule insertion'),
			listItem.extra('label', 'css transitions'),
			listItem.extra('label', 'async operations'),
			listItem.extra('label', 'event listeners setting and removal')
		])
	)
).create().update().moveTo(D.body)
