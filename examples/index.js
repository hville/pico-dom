document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function () {
'use strict';

var D = typeof document !== 'undefined' ? document : null;

/**
* @function setDocument
* @param  {Document} doc DOM document
* @return {Document} DOM document
*/

/**
 * @constructor
 * @param {Function} method
 * @param {*} [a]
 * @param {*} [b]
 */
function Op(method, a, b) {
	this.f = method;
	this.a = a;
	this.b = b;
}

Op.prototype.call = function(ctx) {
	var op = this;
	return !op.f ? op.a
		: op.b === undefined ? op.f.call(ctx, op.a)
		: op.f.call(ctx, op.a, op.b)
};

function Template(constructor, transforms) {
	this.Co = constructor;
	this.ops = transforms || [];
}


Template.prototype = {
	constructor: Template,

	get node () {
		return this.create().node
	},

	create: function(parent, key) {
		var ops = this.ops,
				cmp = new this.Co(ops[0].call(D));
		if (parent) cmp.root = parent.root || parent;
		if (key !== undefined) cmp.key = key;
		for (var i=1; i<ops.length; ++i) ops[i].call(cmp);
		return cmp
	},

	clone: function(options) {
		var template = new Template(this.Co, this.ops.slice());
		if (options) template.config(options);
		return template
	},

	// COMPONENT OPERATIONS
	oncreate: function(fcn) {
		this.ops.push(new Op(call, fcn));
		return this
	},

	set: wrapMethod('set'),

	config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this.ops.push(new Op(call, any));
			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var key = ks[i],
							arg = any[ks[i]];
					if (!this[key]) this.set(key, arg);
					else if (Array.isArray(arg)) this[key](arg[0], arg[1]);
					else this[key](arg);
				}
			}
			else this.child(any);
		}
		return this
	},

	// ELEMENT OPERATIONS

	on: wrapMethod('on'),
	attr: wrapMethod('attr'),
	prop: wrapMethod('prop'),
	class: wrapMethod('class'),

	child: function() {
		var proto = this.Co.prototype;
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i];
			if (child != null) {
				if (Array.isArray(child)) this.child.apply(this, child);
				else this.ops.push(
					child.create ? new Op(proto._childTemplate, child) //TODO
					: child.cloneNode ? new Op(proto._childNode, child)
					: new Op(proto._childText, ''+child)
				);
			}
		}
		return this
	}
};


function call(fcn) {
	fcn.call(this, this.node);
}

function wrapMethod(name) {
	return function(a, b) {
		var proto = this.Co.prototype;
		if (typeof proto[name] !== 'function') throw Error (name + ' is not a valid method for this template')
		this.ops.push(new Op(proto[name], a, b));
		return this
	}
}

/**
 * @function
 * @param {string|number} key
 * @param {*} val value
 * @returns {!Object} this
 */
function setThis(key, val) {
	this[key] = val;
	return this
}

var picoKey = '_pico';

function NodeCo(node) {
	if (node[picoKey] || node.parentNode) throw Error('node already used')
	this.node = node;
	// default updater: null || text || value
	if (node.nodeName === '#text') this.update = this.text;
	if ('value' in node && node.nodeName !== 'LI') this.update = this.value;

	node[picoKey] = this.update ? this : null;
	//TODO destroy, ondestroy
}


var ncProto = NodeCo.prototype = {
	constructor: NodeCo,
	root: null,

	// INSTANCE UTILITIES
	set: setThis,

	// NODE SETTERS
	text: function(txt) {
		var first = this.node.firstChild;
		if (first && !first.nextSibling) {
			if (first.nodeValue !== txt) first.nodeValue = txt;
		}
		else this.node.textContent = txt;
		return this
	},
	attr: function(key, val) {
		if (val === false) this.node.removeAttribute(key);
		else this.node.setAttribute(key, val === true ? '' : val);
		return this
	},
	prop: function(key, val) {
		if (this.node[key] !== val) this.node[key] = val;
		return this
	},
	class: function(val) {
		this.node.setAttribute('class', val);
		return this
	},
	value: function(val) {
		if (this.node.value !== val) this.node.value = val;
		return this
	},
	attrs: function(keyVals) {
		for (var i=0, ks=Object.keys(keyVals); i<ks.length; ++i) this.attr(ks[i], keyVals[ks[i]]);
		return this
	},
	props: function(keyVals) {
		for (var i=0, ks=Object.keys(keyVals); i<ks.length; ++i) this.prop(ks[i], keyVals[ks[i]]);
		return this
	},

	_childNode: function (node) { //TODO
		this.node.appendChild(node.cloneNode(true));
	},

	_childTemplate: function (template) {  //TODO
		template.create(this).moveTo(this.node);
	},

	_childText: function appendText(txt) {  //TODO
		this.node.appendChild(D.createTextNode(txt));
	},


	// PLACEMENT

	/**
	* @function
	* @return {!Object} this
	*/
	remove: function() {
		var node = this.node,
				origin = node.parentNode;
		if (origin) {
			if (this.onmove) this.onmove(origin, null);
			origin.removeChild(node);
		}
		return this
	},

	/**
	* @function
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var node = this.node,
				origin = node.parentNode,
				anchor = before || null;
		if (!parent) throw Error('invalid parent node')

		if (origin !== parent || (anchor !== node && anchor !== node.nextSibling)) {
			if (this.onmove) this.onmove(this.node.parentNode, parent);
			parent.insertBefore(node, anchor);
			return this
		}
	},

	// UPDATE
	update: updateChildren,
	updateChildren: updateChildren,
	// EVENT LISTENERS
	handleEvent: function(event) {
		var handlers = this._on,
				handler = handlers && handlers[event.type];
		if (handler) handler.call(this, event);
	},
	on: function(type, handler) {
		if (typeof type === 'object') for (var i=0, ks=Object.keys(type); i<ks.length; ++i) {
			this.registerHandler(ks[i], type[ks[i]]);
		}
		else this.registerHandler(handler, type);
		return this
	},
	registerHandler: function(handler, type) {
		if (!handler) {
			if (this._on && this._on[type]) {
				delete this._on[type];
				this.node.removeEventListener(type, this, false);
			}
		}
		else {
			if (!this._on) this._on = {};
			this._on[type] = handler;
			this.node.addEventListener(type, this, false);
		}
	}
};

function updateChildren(v,k,o) {
	var child = this.node.firstChild;
	while (child) {
		var co = child[picoKey];
		if (co) {
			if (co.update) co.update(v,k,o);
			child = (co.foot || child).nextSibling;
		}
		else child = child.nextSibling;
	}
}

function ListK(template) {
	this.template = template;
	this.refs = {};
	this.node = D.createComment('^');
	this.foot = D.createComment('$');
	this.node[picoKey] = this;
}

ListK.prototype = {
	constructor: ListK,
	root: null,
	set: setThis,

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
			if (this.onmove) this.onmove(origin, parent);

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
				origin = head.parentNode;

		if (origin) {
			if (this.onmove) this.onmove(origin, null);
			this._clearFrom(head.nextSibling);
			origin.removeChild(this.foot);
			origin.removeChild(head);
		}

		return this
	},

	getKey: function(v,k) { return k }, // default: indexed

	update: updateKeyedChildren,

	updateChildren: updateKeyedChildren,


	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent);
		else if (item.node === spot.nextSibling) spot[picoKey].moveTo(parent, foot);
		else if (item.node !== spot) item.moveTo(parent, spot);
		return item.foot || item.node
	},

	_clearFrom: function(spot) {
		while(spot !== this.foot) {
			var item = spot[picoKey];
			spot = (item.foot || item.node).nextSibling;
			item.remove();
		}
	}
};


function updateKeyedChildren(arr) {
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
	this._clearFrom(spot);
	return this
}

function ListS(template) {
	this.template = template;
	this.refs = {};
	this.node = D.createComment('^');
	this.foot = D.createComment('$');
	this.node[picoKey] = this;

	for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
		var key = ks[i],
				model = template[ks[i]];
		this.refs[ks[i]] = model.create(this, key);
	}
}

ListS.prototype = {
	constructor: ListS,
	root: null,
	set: setThis,
	moveTo: ListK.prototype.moveTo,
	remove: ListK.prototype.remove,

	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this.refs) }, //eslint-disable-line no-unused-vars

	update: updateListChildren,
	updateChildren: updateListChildren,
	_placeItem: ListK.prototype._placeItem,
	_clearFrom: ListK.prototype._clearFrom

};

function updateListChildren(v,k,o) {
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
	this._clearFrom(spot);
	return this
}

var svgURI = 'http://www.w3.org/2000/svg';


/**
 * @function svg
 * @param {string} tag tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function svg(tag, options) { //eslint-disable-line no-unused-vars
	var model = new Template(NodeCo, [new Op(D.createElementNS, svgURI, tag)]);
	for (var i=1; i<arguments.length; ++i) model.config(arguments[i]);
	return model
}


/**
 * @function element
 * @param {string} tagName tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function element(tagName, options) { //eslint-disable-line no-unused-vars
	var model = new Template(NodeCo, [new Op(D.createElement, tagName)]);
	for (var i=1; i<arguments.length; ++i) model.config(arguments[i]);
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
 * @param {!Node} node source node
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function template(node, options) { //eslint-disable-line no-unused-vars
	if (!node.cloneNode) throw Error('invalid node')

	var modl = new Template(NodeCo, [new Op(cloneNode, node)]);
	for (var i=1; i<arguments.length; ++i) modl.config(arguments[i]);
	return modl
}

function cloneNode(node) {
	return node.cloneNode(true)
}


/**
 * @function list
 * @param {Object|Array} model model
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function list(model, options) { //eslint-disable-line no-unused-vars
	var lst = new Template(
		model.create ? ListK : ListS,
		[new Op(null, model)]
	);

	for (var i=1; i<arguments.length; ++i) lst.config(arguments[i]);
	return lst
}

// @ts-check

// create template

// generic simple store for the examples

function Store(config) {
	this.data = {};
	for (var i=0, ks=Object.keys(config); i<ks.length; ++i) this[ks[i]] = config[ks[i]];
}

Store.prototype = {
	constructor: Store,

	get: function(path) {
		var data = this.data;
		switch (arguments.length) {
			case 0: return data
			case 1:
				if (Array.isArray(path)) {
					for (var i=0; i<path.length; ++i) if ((data = data[path[i]]) === undefined) break
					return data
				}
				else return data[path]
			default:
				return this.get.apply(this, arguments)
		}
	},

	set: function(value, path) {
		var data = this.data;
		switch (arguments.length) {
			case 0: throw Error('value required')
			case 1:
				this.data = value;
				break
			case 2:
				if (Array.isArray(path)) {
					for (var i=0; i<(path.length-1); ++i) if ((data = data[path[i]]) === undefined) throw Error('invalid path '+path.join())
					data[path[path.length-1]] = value;
				}
				else {
					data[path] = value;
				}
				break
			default:
				throw Error('invalid argument')
		}
		if (this.onchange) this.onchange();
	},

	act: function(name, args) {
		return this[name].apply(this, args)
	}
};

// immutable templates, svg elements
var ic_circle = template( // template used to pre-resolve the node structure
	svg('svg')
	.attr('fill', '#000000')
	.attr('height', '24')
	.attr('viewBox', '0 0 24 24')
	.attr('width', '24')
	.child(
		svg('path')
		.attr('fill', 'none')
		.attr('d', 'M0 0h24v24H0z')
	).node
);

var ic_add = ic_circle.clone().child( //ic_add_circle_outline_black_36px
	svg('path').attr('d',
		'M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
	).node
);

var ic_clear = ic_circle.clone().child( //ic_clear_black_36px
	svg('path').attr('d',
		'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
	).node
);

var ic_remove = ic_circle.clone().child( //ic_remove_circle_outline_black_36px
	svg('path').attr('d',
		'M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
	).node
);

var i = 0;
var j = 0;

var tableTemplate = element('table',
	element('tbody',
		list(
			element('tr')
			.class('abc')
			.oncreate(function() { i = this.key; })
			.child(
				element('td')
				.oncreate(function() { this.i = i; })
				.on('click', function() { this.root.store.delRow(this.i);})
				.child(
					ic_remove // title column
				),
				list( // data columns
					element('td', function() { j = this.key; },
						element('input')
						.oncreate(function() { this.i = i; this.j = j; })
						.set('update', function(val) { this.node.value = val; })
						.on('change', function() { this.root.store.set(this.node.value, [this.i, this.j]); })
					)
				)
			)
		),
		element('tr').child(
			element('td')
			.on('click', function() { this.root.store.addRow(); })
			.child(ic_add)
		)
	)
); //741

var store = new Store([]);
var table = tableTemplate.create().set('store', store).moveTo(document.body);

store.onchange = function() { table.update( store.get() ); };
store.set([['Jane', 'Roe'], ['John', 'Doe']]);

store.addRow = function() {
	store.set(['',''], store.get().length);
};
store.delRow = function(idx) {
	var data = store.get().slice();
	data.splice(idx,1);
	store.set(data);
};

}());
