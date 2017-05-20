/* hugov@runbox.com | https://github.com/hville/pico-dom.git | license:MIT */
(function (exports) {
'use strict';

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
 * @function
 * @param {!Object} obj source
 * @param {Function} fcn reducer
 * @param {*} res accumulator
 * @param {*} [ctx] context
 * @returns {*} accumulator
 */
function reduce(obj, fcn, res, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) res = fcn.call(ctx, res, obj[ks[i]], ks[i], obj);
	return res
}

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
	// PLACEMENT
	append: function() {
		for (var i=0; i<arguments.length; ++i) {
			var arg = arguments[i];
			if (arg != null) {
				if (Array.isArray(arg)) this.append.apply(this, arg);
				else if (arg.create) arg.create({common: this.common}).moveTo(this.node);
				else if (arg.moveTo) arg.moveTo(this.node);
				else this.node.appendChild(createNode(arg));
			}
		}
		return this
	},
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
		if (typeof type === 'object') each(type, this.registerHandler, this);
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

function Op(fcn, a, b) {
	this.f = fcn;
	this.a = a;
	this.b = b;
}

Op.prototype = {
	call: function(ctx) {
		var op = this;
		return op.b === undefined ? op.f.call(ctx, op.a) : op.f.call(ctx, op.a, op.b)
	}
};

/**
 * @constructor
 * @param {Node} node - DOM node
 * @param {Array} [transforms] - configuration
 */
function NodeModel(node, transforms) {
	this.node = node;
	this.ops = transforms || [];
}

NodeModel.prototype = {
	constructor: NodeModel,

	assign: function(key, val) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.assign, key, val)))
	},

	create: function(keyVal) {
		var co = new NodeCo(this.node.cloneNode(true)),
				ops = this.ops;
		if (keyVal) co.assign(keyVal);
		for (var i=0; i<ops.length; ++i) ops[i].call(co);
		return co
	},

	on: function(name, handler) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.on, name, handler)))
	},

	attr: function(name, value) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.attr, name, value)))
	},

	prop: function(key, val) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.prop, key, val)))
	},

	class: function(name) {
		return new NodeModel(this.node, this.ops.concat(new Op(ncProto.class, name)))
	},

	call: function(fcn) {
		return new NodeModel(this.node, this.ops.concat(new Op(call, fcn)))
	},

	_config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this.ops.push(new Op(call, any));
			else if (any.constructor === Object) each(any, this.addTransform, this);
			else childOps.call(this.ops, any);
		}
		return this
	},

	child: function() {
		return new NodeModel(this.node, childOps.apply(this.ops.slice(), arguments))
	},

	addTransform: function(argument, name) {
		if (Array.isArray(argument)) this.ops.push(new Op(ncProto[name], argument[0], argument[1]));
		else this.ops.push(new Op(ncProto[name], argument));
	}
};

function appendChild(node) { //mode to co._appendXXX
	this.node.appendChild(node.cloneNode(true));
}

function appendTemplate(template) { //mode to co._appendXXX
	template.create({common: this.common}).moveTo(this.node);
}

function appendText(txt) { //mode to co._appendXXX
	this.node.appendChild(exports.D.createTextNode(txt));
}

function call(fcn) {
	fcn.call(this, this.node);
}


function childOps() {
	for (var i=0; i<arguments.length; ++i) {
		var child = arguments[i];
		if (child != null) {
			if (Array.isArray(child)) childOps.apply(this, child);
			else this.push(
				child.create ? new Op(appendTemplate, child)
				: child.cloneNode ? new Op(appendChild, child)
				: new Op(appendText, ''+child)
			);
		}
	}
	return this
}

/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
function ListK(template, options) {
	this._init(template, options);
}

ListK.prototype = {
	constructor: ListK,
	common: null,
	assign: assignToThis,

	_init: function(template, options) {
		this._template = template;
		this._items = {};
		this.node = exports.D.createComment('^');
		this.foot = exports.D.createComment('$');
		this.assign(options);
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

	_placeItem: function(parent, item, spot) { //TODO
		return item._template ? insertList(parent, item, spot).foot //TODO move behaviour to component
		: item.node ? insertChild(parent, item.node, spot)
		: insertChild(parent, item, spot)
	}
};

function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(exports.D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this._items,
			newM = {};
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


function insertChild(parent, node, spot) {
	if (!spot) parent.appendChild(node);
	else if (node === spot.nextSibling) parent.removeChild(spot); // later cleared or re-inserted
	else if (node !== spot) parent.insertBefore(node, spot);
	return node
}


function insertList(parent, list, spot) {
	if (!spot) return list.moveTo(parent)
	var head = list.node;
	if (head === spot.nextSibling) parent.removeChild(spot); // later cleared or re-inserted
	else if (head !== spot) list.moveTo(parent, spot);
	return list
}

/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
function ListS(template, options) {
	this._init(template, options);

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
	assign: assignToThis,
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

//import {ListA} from './ListA'
//import {D} from './document'


/**
 * @constructor
 * @param {!Object} model
 * @param {Object} [options]
 */
function ListModel(model, options) {
	this._template = model;
	if (options) this._assign(options);
}


var lmProto = ListModel.prototype;


lmProto.config = function(config) { //TODO delete
	return (new ListModel(this._template, this))._config(config)
};


lmProto.assign = function(key, val) {
	return (new ListModel(this._template, this))._assign(key, val)
};


lmProto.create = function(config) {
	var model = config ? this.config(config) : this;
	return new (model._template.create || model._template.cloneNode ? ListK : ListS)(model._template, model)
};


lmProto._assign = assignToThis;


lmProto._config = function(any) {
	if (any != null) {
		if (typeof any === 'function') any(this);
		else if (any.constructor === Object) for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
			var key = ks[i],
					val = any[key],
					fcn = this[key];
			if (typeof fcn === 'function') Array.isArray(val) ? fcn.apply(this, val) : fcn(val);
			else this._assign(key, val);
		}
	}
	return this
};

var svgURI = 'http://www.w3.org/2000/svg';


/**
 * @function svg
 * @param {string} tag tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function svg(tag, options) { //eslint-disable-line no-unused-vars
	var model = new NodeModel(exports.D.createElementNS(svgURI, tag));
	for (var i=1; i<arguments.length; ++i) model._config(arguments[i]);
	return model
}


/**
 * @function element
 * @param {string} tagName tagName
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function element(tagName, options) { //eslint-disable-line no-unused-vars
	var model = new NodeModel(exports.D.createElement(tagName));
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
function elementNS(nsURI, tag, options) { //eslint-disable-line no-unused-vars
	var model = new NodeModel(exports.D.createElementNS(nsURI, tag));
	for (var i=2; i<arguments.length; ++i) model._config(arguments[i]);
	return model
}

/**
 * @function text
 * @param {string} txt textContent
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function text(txt, options) { //eslint-disable-line no-unused-vars
	var model = new NodeModel(exports.D.createTextNode(txt));
	for (var i=1; i<arguments.length; ++i) model._config(arguments[i]);
	return model
}


/**
 * @function template
 * @param {Node|Object} model source node or template
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function template(model, options) { //eslint-disable-line no-unused-vars
	var modl = new NodeModel(createNode(model));
	for (var i=1; i<arguments.length; ++i) modl._config(arguments[i]);
	return modl
}


function createNode(model) {
	if (model.cloneNode) return model.cloneNode(true)
	if (typeof model === 'number' || typeof model === 'string') return exports.D.createTextNode('' + model)
	if (model.create) return model.create().node
	if (model.node) return model.node.cloneNode(true)
	else throw Error('invalid node source' + typeof model)
}

/**
 * @function list
 * @param {Object|Array} model model
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function list(model, options) { //eslint-disable-line no-unused-vars
	var modl = getModel(model);
	if (!modl) throw Error('invalid list template: ' + typeof model)
	var lst = new ListModel(modl);
	for (var i=1; i<arguments.length; ++i) lst._config(arguments[i]);
	return lst
}


function getModel(tmpl) {
	return Array.isArray(tmpl) ? tmpl.map(getModel)
		: tmpl.constructor === Object ? reduce(tmpl, getModels, {})
		: tmpl.create ? tmpl // templates are immutable and can be used 'as-is'
		: createNode(tmpl)
}


function getModels(models, tmpl, key) {
	models[key] = getModel(tmpl);
	return models
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

}((this.picoDOM = this.picoDOM || {})));
