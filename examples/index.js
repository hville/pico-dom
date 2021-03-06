document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function () {
'use strict';

var D = typeof document !== 'undefined' ? document : null;

/**
* @function setDocument
* @param  {Document} doc DOM document
* @return {Document} DOM document
*/

function Template(constructor, transforms) {
	this.Co = constructor;
	this.ops = transforms;
}

var TemplateProto = Template.prototype = {
	constructor: Template,

	create: function(parent, key) {
		var ops = this.ops,
				cmp = new this.Co(ops[0].f ? ops[0].f.apply(D, ops[0].a) : ops[0].a[0]);

		if (parent) cmp.root = parent.root || parent;
		else if (!cmp.refs) cmp.refs = {};

		if (key !== undefined) cmp.key = key;

		for (var i=1; i<ops.length; ++i) ops[i].f.apply(cmp, ops[i].a);
		return cmp
	},

	call: function(fcn) {
		return new Template(this.Co, this.ops.concat({f: fcn, a:[]}))
	},

	text: wrapMethod('text'),
	extra: wrapMethod('extra'),
	prop: wrapMethod('prop'),
	attr: wrapMethod('attr'),
	class: wrapMethod('class'),
	event: wrapMethod('event'),

	append: wrapMethod('append'),

	_config: function(any) {
		var cProto = this.Co.prototype;
		if (any != null) {

			// transform
			if (typeof any === 'function') this.ops.push({f: any, a:[]});

			// options
			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var methodName = ks[i],
							arg = any[ks[i]];

					// text, class
					if (this[methodName] && cProto[methodName]) this.ops.push({f: cProto[methodName], a:[arg]});

					// extra(s), prop(s), attr(s), event(s)
					else if (methodName[methodName.length-1] === 's' && this[methodName = methodName.slice(0,-1)] && cProto[methodName]) {
						for (var j=0, kks=Object.keys(arg); j<kks.length; ++j) this.ops.push(
							{f: cProto[methodName], a: [kks[j], arg[kks[j]]]}
						);
					}
					// none of the above
					else throw Error (ks[i] + ' is not a template method')
				}
			}

			// child
			else if (cProto.append) this.ops.push({f: cProto.append, a: [any]});
			else throw Error('invalid argument '+any)
		}
		return this
	}
};

function wrapMethod(name) {
	return function() {
		var cProto = this.Co.prototype;
		for (var i=0, args=[]; i<arguments.length; ++i) args[i] = arguments[i];
		if (!cProto[name]) throw Error (name + ' is not a template method')
		return new Template(this.Co, this.ops.concat({f: cProto[name], a: args}))
	}
}

var picoKey = '_pico';

function CElement(node) {
	this.root = null;
	this.node = node;
	this.update = this.updateChildren;
	node[picoKey] = this;
}

var CElementProto = CElement.prototype = {
	constructor: CElement,

	/**
	* @function
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var node = this.node,
				anchor = before || null;
		if (!parent) throw Error('invalid parent node')

		if (node.parentNode !== parent || (anchor !== node && anchor !== node.nextSibling)) {
			parent.insertBefore(node, anchor);
		}
		return this
	},

	/**
	* @function
	* @return {!Object} this
	*/
	remove: function() {
		var node = this.node,
				origin = node.parentNode;
		if (origin) origin.removeChild(node);
		return this
	},

	destroy: function() {
		this.remove();
		if (this._events) for (var i=0, ks=Object.keys(this._events); i<ks.length; ++i) this.event(ks[i], false);
		return this
	},

	/**
	 * @function
	 * @param {string|number} key
	 * @param {*} val value
	 * @returns {!Object} this
	 */
	extra: function(key, val) {
		this[key] = val;
		return this
	},

	prop: function(key, val) {
		if (this.node[key] !== val) this.node[key] = val;
		return this
	},

	text: function(txt) {
		this.node.textContent = txt;
		return this
	},

	attr: function(key, val) {
		if (val === false) this.node.removeAttribute(key);
		else this.node.setAttribute(key, val === true ? '' : val);
		return this
	},

	class: function(val) {
		this.node.setAttribute('class', val);
		return this
	},

	append: function() {
		var node = this.node;
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i];
			if (child != null) {
				if (Array.isArray(child)) this.append.apply(this, child);
				else if (child.create) child.create(this).moveTo(node);
				else if (child.moveTo) child.moveTo(node);
				else node.appendChild(
					child.cloneNode ? child.cloneNode(true) : D.createTextNode(''+child)
				);
			}
		}
		return this
	},

	// EVENT LISTENERS
	handleEvent: function(event) {
		var handlers = this._events,
				handler = handlers && handlers[event.type];
		if (handler) handler.call(this, event);
	},

	event: function(type, handler) {
		if (!handler) {
			if (this._events && this._events[type]) {
				delete this._events[type];
				this.node.removeEventListener(type, this, false);
			}
		}
		else {
			if (!this._events) this._events = {};
			this._events[type] = handler;
			this.node.addEventListener(type, this, false);
		}
	},

	updateChildren: function updateChildren(v,k,o) {
		var child = this.node.firstChild;
		while (child) {
			var co = child[picoKey];
			if (co) {
				if (co.update) co.update(v,k,o);
				child = (co.foot || child).nextSibling;
			}
			else child = child.nextSibling;
		}
		return this
	}
};

/**
 * @constructor
 * @param {Node} node - DOM node
 */

function CList(template) {
	this.root = null;
	this.template = template;
	this.node = D.createComment('^');
	this.foot = D.createComment('$');
	this.refs = {};
	this.node[picoKey] = this;

	//keyed
	if (template.create) this.update = this.updateChildren;
	// select list
	else {
		this.update = this.updateChildren = updateSelectChildren;
		for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
			var key = ks[i];
			this.refs[key] = template[key].create(this, key);
		}
	}
}

CList.prototype = {
	constructor: CList,
	extra: CElementProto.extra,
	prop: CElementProto.prop,
	destroy: CElementProto.destroy,


	/**
	* @function moveTo
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				next = this.node,
				origin = next.parentNode,
				anchor = before || null;

		if (!parent) throw Error('invalid parent node')

		if (origin !== parent || (anchor !== foot && anchor !== foot.nextSibling)) {

			if (origin) { // relocate
				var cursor;
				do next = (cursor = next).nextSibling;
				while (parent.insertBefore(cursor, anchor) !== foot)
			}
			else { // insertion
				parent.insertBefore(next, anchor);
				parent.insertBefore(foot, anchor);
			}
		}
		return this
	},


	/**
	* @function remove
	* @return {!Object} this
	*/
	remove: function() {
		var head = this.node,
				origin = head.parentNode,
				spot = head.nextSibling;

		if (origin) {
			while(spot !== this.foot) {
				var item = spot[picoKey];
				spot = (item.foot || item.node).nextSibling;
				item.remove();
			}
			origin.removeChild(this.foot);
			origin.removeChild(head);
		}

		return this
	},

	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent);
		else if (item.node === spot.nextSibling) spot[picoKey].moveTo(parent, foot);
		else if (item.node !== spot) item.moveTo(parent, spot);
		return item.foot || item.node
	},

	// FOR KEYED LIST
	getKey: function(v,i,a) { //eslint-disable-line no-unused-vars
		return i  // default: indexed
	},

	updateChildren: function updateKeyedChildren(arr) {
		var foot = this.foot,
				parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
				spot = this.node.nextSibling,
				items = this.refs,
				newM = Object.create(null);
		if (this.node.parentNode !== foot.parentNode) throw Error('keyedlist update parent mismatch')

		for (var i=0; i<arr.length; ++i) {
			var key = this.getKey(arr[i], i, arr),
					model = this.template,
					item = newM[key] = items[key] || model.create(this, key);

			if (item) {
				if (item.update) item.update(arr[i], i, arr);
				spot = this._placeItem(parent, item, spot, foot).nextSibling;
			}
		}

		this.refs = newM;
		while(spot !== this.foot) {
			item = spot[picoKey];
			spot = (item.foot || item.node).nextSibling;
			item.destroy();
		}
		return this
	},

	// FOR SELECT LIST
	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this.refs) } //eslint-disable-line no-unused-vars
};


function updateSelectChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			keys = this.select(v,k,o);
	if (this.node.parentNode !== foot.parentNode) throw Error('selectlist update parent mismatch')

	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]];
		if (item) {
			if (item.update) item.update(v,k,o);
			spot = this._placeItem(parent, item, spot, foot).nextSibling;
		}
	}
	while(spot !== this.foot) {
		item = spot[picoKey];
		spot = (item.foot || item.node).nextSibling;
		item.remove();
	}
	return this
}

/**
 * @function element
 * @param {string} tagName tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function element(tagName, options) { //eslint-disable-line no-unused-vars
	var model = new Template(CElement, [{f: D.createElement, a: [tagName]}]);
	for (var i=1; i<arguments.length; ++i) model._config(arguments[i]);
	return model
}

/**
 * @function elementNS
 * @param {string} nsURI namespace URI
 * @param {string} tag tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */


/**
 * @function text
 * @param {string} txt textContent
 * @param {...*} [options] options
 * @return {!Object} Component
 */



/**
 * @function template
 * @param {Node|Element} node source node
 * @param {...*} [options] options
 * @return {!Object} Component
 */


function list(model, options) { //eslint-disable-line no-unused-vars
	var lst = new Template(CList, [{f:null, a:[model]}]);

	for (var i=1; i<arguments.length; ++i) lst._config(arguments[i]);
	return lst
}

var sheet = null;

function css$$1(cssRuleText) {
	(sheet || getSheet()).insertRule(
		cssRuleText,
		sheet.cssRules.length
	);
}

function getSheet() {
	var sheets = D.styleSheets,
			media = /^$|^all$/; //mediaTypes: all, print, screen, speach

	// get existing sheet
	for (var i=0; i<sheets.length; ++i) {
		sheet = sheets[i];
		if (media.test(sheet.media.mediaText) && !sheet.disabled) return sheet
	}
	// or create a new one
	return sheet = D.head.appendChild(D.createElement('style')).sheet
}

// @ts-check

// create template

css$$1('.transitionEx { opacity: 0.5; transition: all 1s ease; }');
css$$1('.transitionIn { opacity: 1.0; transition: all 1s ease; }');

var optionValues = {
	templates: 'immutable template',
	lists: 'select list',
	components: 'dynamic components',
	css: 'css rule insertion',
	transitions: 'css transitions',
	async: 'async operations',
	events: 'event listeners setting and removal'
};

var optionKeys = Object.keys(optionValues);


var select = element('select',
	list( optionKeys.map(function(k) {
		return element('option', {attr: 'selected'}, k)
	}))
)
.attr('multiple')
.attr('size', optionKeys.length);


var item = element('li',
	function() {
		var comp = this,
				moveTo = comp.moveTo,
				destroy = comp.destroy;

		this.class('transitionEx pl5 light-blue');

		// on insert, async change of the class to trigger transition
		this.moveTo = function(parent, before) {
			if (!this.node.parentNode) D.defaultView.requestAnimationFrame(function() {
				comp.class('transitionIn pl1 dark-blue' );
			});
			return moveTo.call(this, parent, before)
		};

		// on remove, change the class and wait for transition end before removing
		this.destroy = function() {
			this.event('transitionend', function() {
				this.event('transitionend'); //remove the listener
				destroy.call(comp);
			});
			if (this.node.parentNode) D.defaultView.requestAnimationFrame(function() {
				comp.class('transitionEx pl5 light-blue');
			});
			return this
		};
		this.update = this.text;
	}
);


element('div',
	element('h2', {class: 'pl3'}, 'example with'),
	element('div', {class: ''},
		element('div', {class: 'fl w-25 pa3'},
			select.class('v-top').call(function() {
				this.root.refs.select = this;
				this.event('change', function() { this.root.update(); });
			})
		),
		element('div', {class: 'fl w-25 pa3'},
			element('ol', {class: 'v-top'},
				list(
					item
				).extra('update', function() {
					var opts = this.root.refs.select.node.options,
							keys = [];
					for (var i=0; i<opts.length; ++i) if (opts.item(i).selected) keys.push(opts.item(i).textContent);
					this.updateChildren(keys);
				}).extra('getKey', function(v) { return v })
			)
		),
		element('div', {class: 'fl w-50 pa3'})
	)
).create().update().moveTo(D.body);

}());
