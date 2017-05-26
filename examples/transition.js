import {text, element as el, list} from '../module'
import {ic_remove, ic_add} from './icons'

var data = ['a', 'b', 'c']

el('table',
	el('ol',
		list(
			el('li')
			.on('click', function(e) {
				var idx = data.indexOf(this.key),
						id = e.target.id || e.target.parentNode.id
				console.log('CLICK', id, idx, data.length, data)
				if (id === 'del') data.splice(idx, 1)
				else if (id === 'add') data.splice(idx, 0, this.key+idx)
				else console.log('CLASS', this.node.className), this.class('f4 blue'), this.attr('style', 'opacity: 0.8;')//this.node.style.opacity = '.8'
				this.root.update(data)
			})
			.call(function() {})

			.on('transitionend', function(e) { console.log(e.name) })
			.class('f6 darkest-blue')
			.attr('style', 'opacity: 0.1')
			.append(
				ic_add.attr('id', 'add'),
				text(''),
				ic_remove.attr('id', 'del')
			)
			.call(function() {
				var ctx = this
				this.node.ownerDocument.defaultView.requestAnimationFrame(
					function() { ctx.attr('style', 'transition: all 9s ease; opacity: 1') },
			) })
			//class('f6 darkest-blue')
			//.attr('style', 'opacity: 1')
			//.class('f1 orange')
		).extra('getKey', function(v) { return v })
	)
)
.create()
.update(data)
.moveTo(document.body)
