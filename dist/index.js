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
 * @param {!Function} constructor
 * @param {!Array} transforms
 */
function Template(constructor, transforms) {
	this.Co = constructor;
	this.ops = transforms || [];
}


Template.prototype = {
	constructor: Template,

	//COMMON

	create: function(parent, key) {
		var ops = this.ops,
				cmp = new this.Co(run(ops[0], exports.D));

		if (parent) cmp.root = parent.root || parent;
		if (key !== undefined) cmp.key = key;

		for (var i=1; i<ops.length; ++i) run(ops[i], cmp);
		return cmp
	},

	// COMPONENT OPERATIONS
	call: function(fcn) {
		for (var i=1, args=[]; i<arguments.length; ++i) args[i-1] = arguments[i];
		return this._clone({f: fcn, a:args})
	},

	_clone: function(op) {
		var ops = this.ops;
		return new Template(this.Co, ops.concat(op))
	},

	_ops: function(fcn, obj) {
		for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) {
			this.ops.push({f: fcn, a: [ks[i], obj[ks[i]]]});
		}
		return this
	},

	_config: function(any) {
		var cProto = this.Co.prototype;
		if (any != null) {

			if (typeof any === 'function') this.ops.push({f: any, a:[]});

			else if (any.constructor === Object) {
				for (var i=0, ks=Object.keys(any); i<ks.length; ++i) {
					var key = ks[i];
					if (!this[key]) throw Error (key + ' is not a template method')

					if (key[key.length-1] === 's' && any[key].constructor === Object) {
						// break group functions extras, props, attrs
						this._ops(cProto[key.slice(0,-1)], any[key]);
					}
					else {
						this.ops.push({f: cProto[key], a:[any[key]]});
					}
				}
			}
			else if (cProto.append) this.ops.push({f: cProto.append, a: [any]});
			else throw Error('invalid argument '+any)
		}
		return this
	},

	extra: wrapMethod('extra'),
	extras: wrapMany('extra'),

	// ELEMENT OPERATIONS

	attr: wrapMethod('attr'),
	attrs: wrapMany('attr'),

	event: wrapMethod('event'),
	events: wrapMany('event'),

	prop: wrapMethod('prop'),
	props: wrapMany('prop'),

	class: wrapMethod('class'),
	append: wrapMethod('append')
};

function wrapMany(name) {
	return function(a) {
		return this._clone([])._ops(this.Co.prototype[name], a)
	}
}

function wrapMethod(name) {
	return function() {
		for (var i=0, args=[]; i<arguments.length; ++i) args[i] = arguments[i];
		return this._clone({f: this.Co.prototype[name], a: args})
	}
}

function run(op, ctx) {
	return op.f ? op.f.apply(ctx, op.a) : op.a[0]
}

var picoKey = '_pico';

/**
 * @function
 * @param {!Object} obj
 * @param {Function} fcn
 * @param {*} [ctx]
 * @returns {void}
 */
function eachKeys(obj, fcn, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) fcn.call(ctx, ks[i], obj[ks[i]]);
}

/**
 * @constructor
 * @extends EventListener
 * @param {Node} node - DOM node
 */
function Extra(node) {
	if (node[picoKey] || node.parentNode) throw Error('node already used')
	this.node = node;

	// default updater: null || text || value
	if (node.nodeName === '#text') this.update = this.text;
	if ('value' in node && node.nodeName !== 'LI') this.update = this.value;

	node[picoKey] = this;
}


var extraProto = Extra.prototype = {
	constructor: Extra,

	// INSTANCE UTILITIES
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
		eachKeys(keyVals, this.attr, this);
		return this
	},
	props: function(keyVals) {
		eachKeys(keyVals, this.prop, this);
		return this
	},
	extras: function(keyVals) {
		eachKeys(keyVals, this.extra, this);
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
					child.cloneNode ? child.cloneNode(true) : exports.D.createTextNode(''+child)
				);
			}
		}
		return this
	},


	// PLACEMENT


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
		if (this.ondestroy && this.ondestroy()) return this
		this.remove();
		if (this._events) for (var i=0, ks=Object.keys(this._events); i<ks.length; ++i) this.event(ks[i], false);
		this.node = this.refs = null;
	},

	// UPDATE
	update: updateChildren,
	updateChildren: updateChildren,
	// EVENT LISTENERS
	handleEvent: function(event) {
		var handlers = this._events,
				handler = handlers && handlers[event.type];
		if (handler) handler.call(this, event);
	},
	events: function(handlers) {
		eachKeys(handlers, this.event, this);
		return this
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
function List(template) {
	this.template = template;
	this.refs = {};
	this.node = exports.D.createComment('^');
	this.foot = exports.D.createComment('$');
	this.node[picoKey] = this;

	if (!template.create) { // select list
		this.update = this.updateChildren = updateSelectChildren;
		for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
			var key = ks[i];
			this.refs[key] = template[key].create(this, key);
		}
	}
}

List.prototype = {
	constructor: List,

	extra: extraProto.extra,

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

	destroy: extraProto.destroy,

	update: updateKeyedChildren,

	updateChildren: updateKeyedChildren,

	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent);
		else if (item.node === spot.nextSibling) spot[picoKey].moveTo(parent, foot);
		else if (item.node !== spot) item.moveTo(parent, spot);
		return item.foot || item.node
	},

	// FOR KEYED LIST

	getKey: function(v,k) { return k }, // default: indexed

	// FOR SELECT LIST

	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this.refs) }, //eslint-disable-line no-unused-vars

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

function updateSelectChildren(v,k,o) {
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
	var model = new Template(Extra, [{f: exports.D.createElementNS, a:[svgURI, tag]}]);
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
	var model = new Template(Extra, [{f: exports.D.createElement, a: [tagName]}]);
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
	var model = new Template(Extra, [{f: exports.D.createElementNS, a: [nsURI, tag]}]);
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
	var model = new Template(Extra, [{f: exports.D.createTextNode, a: [txt]}]);
	for (var i=1; i<arguments.length; ++i) model._config(arguments[i]);
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

	var modl = new Template(Extra, [{f: cloneNode, a: [node]}]);
	for (var i=1; i<arguments.length; ++i) modl._config(arguments[i]);
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
	var lst = new Template(List, [{f:null, a:[model]}]);

	for (var i=1; i<arguments.length; ++i) lst._config(arguments[i]);
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

var sheet = null;

function css$$1(cssRuleText) {
	(sheet || getSheet()).insertRule(
		cssRuleText,
		sheet.cssRules.length
	);
}

function getSheet() {
	var sheets = exports.D.styleSheets,
			media = /^$|^all$/; //mediaTypes: all, print, screen, speach

	// get existing sheet
	for (var i=0; i<sheets.length; ++i) {
		sheet = sheets[i];
		if (media.test(sheet.media.mediaText) && !sheet.disabled) return sheet
	}
	// or create a new one
	return sheet = exports.D.head.appendChild(exports.D.createElement('style')).sheet
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
exports.css = css$$1;
