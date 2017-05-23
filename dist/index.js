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

function Op(fcn, a, b) {
	this.f = fcn;
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
 * @param {!Object} constructor
 * @param {!Array} transforms
 */
function Template(constructor, transforms) {
	this.Co = constructor;
	this.ops = transforms || [];
}

Template.prototype = {
	constructor: Template,

	create: function(keyVal) {
		var ops = this.ops,
				cmp = new this.Co(ops[0].call(exports.D));
		if (keyVal) cmp.assign(keyVal); //TODO common
		for (var i=1; i<ops.length; ++i) ops[i].call(cmp);
		return cmp
	},

	clone: function() {
		return new Template(this.Co, this.ops.slice())
	},

	/*key: function(key) { //TODO name
		return new Template(this.ops.concat(new Op(setKey, key)))
	},*/
	assign: wrapMethod('assign'), //TODO RENAME
	//TODO replace assign with update, select, getKey
	on: wrapMethod('on'),
	attr: wrapMethod('attr'),
	prop: wrapMethod('prop'),
	class: wrapMethod('class'),
	_childNode: wrapMethod('_childNode'),
	_childTemplate: wrapMethod('_childTemplate'),
	_childText: wrapMethod('_childText'),


	call: function(fcn) { //TODO oncreate
		this.ops.push(new Op(call, fcn));
		return this
	},

	config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this.ops.push(new Op(call, any));
			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var key = ks[i],
							arg = any[ks[i]],
							fcn = this.Co.prototype[key];
					if (!fcn) throw Error('invalid method name: ' + key)
					if (Array.isArray(arg)) this.ops.push(new Op(fcn, arg[0], arg[1]));
					else this.ops.push(new Op(fcn, arg));

				}
			}
			else this.child(any);
		}
		return this
	},

	child: function() {
		var proto = this.Co.prototype;
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i];
			if (child != null) {
				if (Array.isArray(child)) this.child.apply(this, child);
				else this.ops.push(
					child.create ? new Op(proto._childTemplate, child)
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
 * @param {!Object} obj source
 * @param {Function} fcn reducer
 * @param {*} res accumulator
 * @param {*} [ctx] context
 * @returns {*} accumulator
 */
/*export function reduce(obj, fcn, res, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) res = fcn.call(ctx, res, obj[ks[i]], ks[i], obj)
	return res
}*/

function each(obj, fcn, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) fcn.call(ctx, obj[ks[i]], ks[i], obj);
}

/**
 * @function
 * @param {string|!Object} key keyOrObject
 * @param {*} [val] value
 * @returns {!Object} this
 */
function assignToThis(key, val) { //eslint-disable-line no-unused-vars
	if (typeof key === 'object') for (var j=0, ks=Object.keys(key); j<ks.length; ++j) {
		if (ks[j][0] !== '_') this[ks[j]] = key[ks[j]];
	}
	else if (key[0] !== '_') this[key] = val;
	return this
}

var picoKey = '_pico';

/**
 * @constructor
 * @extends EventListener
 * @param {Node} node - DOM node
 * @param {Array} ops transforms
 */
function NodeCo(node) {
	if (node[picoKey] || node.parentNode) throw Error('node already used')
	this.node = node;

	// default updater: null || text || value
	if (node.nodeName === '#text') this.update = this.text;
	if ('value' in node) this.update = this.value; //TODO fail on input.type = select

	node[picoKey] = this.update ? this : null;
	//TODO oncreate, ondestroy, onmove, ...
}


var ncProto = NodeCo.prototype = {
	constructor: NodeCo,
	common: null,
	// INSTANCE UTILITIES
	assign: assignToThis, //TODO function assign(key, val) {this[key] = val}

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

	_childNode: function (node) {
		this.node.appendChild(node.cloneNode(true));
	},

	_childTemplate: function (template) {
		template.create({common: this.common}).moveTo(this.node); //TODO common
	},

	_childText: function appendText(txt) {
		this.node.appendChild(exports.D.createTextNode(txt)); //TODO components only?
	},


	// PLACEMENT

	moveTo: function(target, before) {
		if (this.onmove) this.onmove(this.node.parentNode, target)
		;(target.node || target).insertBefore(this.node, before || null);
		return this
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
		if (typeof type === 'object') each(type, this.registerHandler, this); //TODO inline each
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
			co.update(v,k,o);
			child = (co.foot || child).nextSibling;
		}
		else child = child.nextSibling;
	}
}

/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
function ListK(template) {
	this._init(template);
}

ListK.prototype = {
	constructor: ListK,
	common: null,
	assign: assignToThis,

	_init: function(template) {
		this._template = template; //TODO delete
		this._items = {}; //TODO common refs
		this.node = exports.D.createComment('^');
		this.foot = exports.D.createComment('$'); //TODO dynamic
		this.node[picoKey] = this.update ? this : null;
	},

	/**
	* @function moveTo
	* @param  {Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				next = this.node,
				origin = next.parentNode,
				target = parent.node || parent,
				cursor = before || null;
		if (next.parentNode !== foot.parentNode) throw Error('list moveTo parent mismatch')
		if (this.onmove) this.onmove(origin, target);
		// skip case where there is nothing to do
		if (cursor === foot || (origin === target && cursor === foot.nextSibling)) return this

		if (origin) {
			if (target) { // relocate
				do next = (cursor = next).nextSibling;
				while (target.insertBefore(cursor, before) !== foot)
			}
			else { // remove all
				do next = (cursor = next).nextSibling;
				while (origin.removeChild(cursor) !== foot)
			}
		}
		else if (target) { //head and foot only
			target.insertBefore(next, before);
			target.insertBefore(foot, before);
		}

		return this
	},

	getKey: function(v,k) { return k }, // default: indexed

	update: updateKeyedChildren,

	updateChildren: updateKeyedChildren,

	_childTemplate: function (template) {
		this._template = template; //TODO reset or disallow if already set
		return this
	},

	_placeItem: function(parent, item, spot) {
		if (item.foot) {
			if (!spot) return item.moveTo(parent)
			var head = item.node;
			if (head === spot.nextSibling) parent.removeChild(spot); // later cleared or re-inserted
			else if (head !== spot) item.moveTo(parent, spot);
			return item.foot
		}
		var node = item.node || item; //TODO Component Only with lifecycle
		if (!spot) parent.appendChild(node);
		else if (node === spot.nextSibling) parent.removeChild(spot); // later cleared or re-inserted
		else if (node !== spot) parent.insertBefore(node, spot);
		return node
	}
};


function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(exports.D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this._items,
			newM = Object.create(null);
	if (this.node.parentNode !== foot.parentNode) throw Error('keyedlist update parent mismatch')

	for (var i=0; i<arr.length; ++i) {
		var key = this.getKey(arr[i], i, arr),
				model = this._template,
				item = newM[key] = items[key] || (model.cloneNode ? model.cloneNode(true)
					: model.create({common: this.common, key: key}));

		if (item) {
			if (item.update) item.update(arr[i], i, arr);
			spot = this._placeItem(parent, item, spot).nextSibling;
		}
	}

	this._items = newM;

	if (spot !== foot) while (spot !== parent.removeChild(foot.previousSibling)) {} //eslint-disable-line no-empty
	return this
}

/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
function ListS(template) {
	this._init(template);
	// TODO template validation
	for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
		var key = ks[i],
				model = template[ks[i]];
		this._items[ks[i]] = (model.cloneNode ? model.cloneNode(true)
			: model.create({common: this.common, key: key}));
	}
}

ListS.prototype = {
	constructor: ListS,
	common: null,
	assign: assignToThis, //TODO needed?
	_init: ListK.prototype._init,
	moveTo: ListK.prototype.moveTo,

	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this._items) }, //eslint-disable-line no-unused-vars

	update: updateListChildren,
	updateChildren: updateListChildren,
	_placeItem: ListK.prototype._placeItem,
	_childTemplate: ListK.prototype._childTemplate
};

function updateListChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(exports.D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this._items,
			keys = this.select(v,k,o);
	if (this.node.parentNode !== foot.parentNode) throw Error('selectlist update parent mismatch')

	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]];
		if (item) {
			if (item.update) item.update(v,k,o);
			spot = this._placeItem(parent, item, spot).nextSibling; //TODO
		}
	}

	if (spot !== foot) while (spot !== parent.removeChild(foot.previousSibling)) {} //eslint-disable-line no-empty
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
 * @param {Node|Object} model source node or template
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function template(model, options) { //eslint-disable-line no-unused-vars //TODO simplify
	var modl = new Template(NodeCo, [
		model.cloneNode ? new Op(cloneNode, model)
		: typeof model === 'number' ? new Op(exports.D.createTextNode, '' + model)
		: typeof model === 'string' ? new Op(exports.D.createTextNode, model)
		: model.create ? new Op(cloneNode, model.create().node)
		: model.node ? new Op(cloneNode, model.node)
		: model
	]);
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
