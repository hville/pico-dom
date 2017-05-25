/* hugov@runbox.com | https://github.com/hville/pico-dom.git | license:MIT */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

exports.D = typeof document !== 'undefined' ? document : null;

/**
* @function setDocument
* @param  {Document} doc DOM document
* @return {Document} DOM document
*/
function setDocument(doc) {
	return exports.D = doc
}

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

/**
 * @constructor
 * @param {!Function} constructor
 * @param {!Array} transforms
 */
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
				cmp = new this.Co(ops[0].call(exports.D));
		if (parent) cmp.root = parent.root || parent;
		if (key !== undefined) cmp.key = key;

		for (var i=1; i<ops.length; ++i) ops[i].call(cmp);
		if (cmp.oncreate) cmp.oncreate();
		return cmp
	},

	clone: function(options) {
		var template = new Template(this.Co, this.ops.slice());
		if (options) template.config(options);
		return template
	},

	// COMPONENT OPERATIONS
	call: function(fcn) {
		this.ops.push(new Op(call, fcn));
		return this
	},

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
			else this.append(any);
		}
		return this
	},

	extra: wrapMethod('extra'),

	// ELEMENT OPERATIONS

	on: wrapMethod('on'),
	attr: wrapMethod('attr'),
	prop: wrapMethod('prop'),
	class: wrapMethod('class'),

	append: function() {
		var proto = this.Co.prototype;
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i];
			if (child != null) {
				if (Array.isArray(child)) this.append.apply(this, child);
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

/**
 * @constructor
 * @extends EventListener
 * @param {Node} node - DOM node
 */
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
	extra: setThis,

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
		this.node.appendChild(exports.D.createTextNode(txt));
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

	destroy: function() {
		this.remove();
		if (this.ondestroy) this.ondestroy();
		if (this._on) for (var i=0, ks=Object.keys(this._on); i<ks.length; ++i) this.registerHandler(ks[i]);
		this.node = this.refs = null;
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
	on: function(type, handler) { //TODO variadic
		if (typeof type === 'object') for (var i=0, ks=Object.keys(type); i<ks.length; ++i) {
			this.registerHandler(ks[i], type[ks[i]]);
		}
		else this.registerHandler(type, handler);
		return this
	},
	registerHandler: function(type, handler) {
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
	return this
}

/**
 * @constructor
 * @param {!Object} template
 */
function ListK(template) {
	this.template = template;
	this.refs = {};
	this.node = exports.D.createComment('^');
	this.foot = exports.D.createComment('$');
	this.node[picoKey] = this;
}

ListK.prototype = {
	constructor: ListK,
	root: null,
	extra: setThis,

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
				origin = head.parentNode,
				spot = head.nextSibling;

		if (origin) {
			if (this.onmove) this.onmove(origin, null);
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

	destroy: function() {
		this.remove();
		if (this.ondestroy) this.ondestroy();
		this.node = this.refs = null;
	},


	getKey: function(v,k) { return k }, // default: indexed

	update: updateKeyedChildren,

	updateChildren: updateKeyedChildren,


	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent);
		else if (item.node === spot.nextSibling) spot[picoKey].moveTo(parent, foot);
		else if (item.node !== spot) item.moveTo(parent, spot);
		return item.foot || item.node
	}
};


function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(exports.D.createDocumentFragment()).foot.parentNode,
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
}

/**
 * @constructor
 * @param {!Object} template
 */
function ListS(template) {
	this.template = template;
	this.refs = {};
	this.node = exports.D.createComment('^');
	this.foot = exports.D.createComment('$');
	this.node[picoKey] = this;

	for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
		var key = ks[i],
				model = template[ks[i]];
		this.refs[ks[i]] = model.create(this, key);
	}
}

var protoK = ListK.prototype;
ListS.prototype = {
	constructor: ListS,
	root: null,
	extra: setThis,
	moveTo: protoK.moveTo,
	remove: protoK.remove,
	destroy: protoK.destroy,
	_placeItem: protoK._placeItem,

	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this.refs) }, //eslint-disable-line no-unused-vars

	update: updateListChildren,
	updateChildren: updateListChildren
};

function updateListChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(exports.D.createDocumentFragment()).foot.parentNode,
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

var svgURI = 'http://www.w3.org/2000/svg';


/**
 * @function svg
 * @param {string} tag tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function svg(tag, options) { //eslint-disable-line no-unused-vars
	var model = new Template(NodeCo, [new Op(exports.D.createElementNS, svgURI, tag)]);
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
	var model = new Template(NodeCo, [new Op(exports.D.createElement, tagName)]);
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
function elementNS(nsURI, tag, options) { //eslint-disable-line no-unused-vars
	var model = new Template(NodeCo, [new Op(exports.D.createElementNS, nsURI, tag)]);
	for (var i=2; i<arguments.length; ++i) model.config(arguments[i]);
	return model
}

/**
 * @function text
 * @param {string} txt textContent
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function text(txt, options) { //eslint-disable-line no-unused-vars
	var model = new Template(NodeCo, [new Op(exports.D.createTextNode, txt)]);
	for (var i=1; i<arguments.length; ++i) model.config(arguments[i]);
	return model
}


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

function find(start, test, until) { //find(test, head=body, foot=null)
	var spot = start.node || start,
			last = until ? (until.node || until.foot || until) : null,
			comp = spot[picoKey];

	while(!comp || (test && !test(comp))) {
		if (spot === last) return null // specified end reached

		var next = spot.firstChild;
		// if no child get sibling, if no sibling, retry with parent
		if (!next) while(!(next = spot.nextSibling)) {
			spot = spot.parentNode;
			if (spot === null) return null // end of tree reached
		}
		spot = next;
		comp = spot[picoKey];
	}
	return comp
}

// @ts-check

// create template

exports.text = text;
exports.element = element;
exports.svg = svg;
exports.elementNS = elementNS;
exports.list = list;
exports.template = template;
exports.setDocument = setDocument;
exports.find = find;
