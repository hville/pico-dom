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
function NodeCo(node, ops) {
	if (node[picoKey] || node.parentNode) throw Error('node already used')
	this.node = node;

	// default updater: null || text || value
	if (node.nodeName === '#text') this.update = this.text;
	if ('value' in node) this.update = this.value; //TODO fail on input.type = select

	for (var i=0; i<ops.length; ++i) {
		var op = ops[i];
		if (Array.isArray(op.arg)) op.fcn.apply(this, op.arg);
		else op.fcn.call(this, op.arg);
	}

	node[picoKey] = this.update ? this : null;
}


var ncProto = NodeCo.prototype = {
	constructor: NodeCo,
	state: null,
	store: null,
	// INSTANCE UTILITIES
	call: function(fcn) {
		fcn(this);
		return this
	},
	assign: assignToThis,
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
				else if (arg.create) arg.defaults({store: this.store, state: this.state}).create().moveTo(this.node);
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

/**
 * @constructor
 * @param {Node} node - DOM node
 * @param {Array} [transforms] - configuration
 */
function NodeModel(node, transforms) {
	this.node = node;
	this._ops = transforms || [];
}

NodeModel.prototype = {
	constructor: NodeModel,
	config: function(config) {
		return (new NodeModel(this.node, this._ops.slice()))._config(config)
	},
	assign: function(key, val) {
		return new NodeModel(this.node, this._ops.concat({
			fcn: ncProto.assign,
			arg: val === undefined ? key : [key, val]
		}))
	},
	defaults: function(key, val) {
		return new NodeModel(this.node, Array.prototype.concat({
			fcn: ncProto.assign,
			arg: val === undefined ? key : [key, val]
		}, this._ops))
	},
	create: function(config) {
		return new NodeCo(
			this.node.cloneNode(true),
			(config ? this.config(config) : this)._ops
		)
	},
	_config: function(any) {
		if (any != null) {
			if (typeof any === 'function') this._ops.push({fcn: ncProto.call, arg: any});
			else if (any.constructor === Object) each(any, this.addTransform, this);
			else this._ops.push({fcn: ncProto.append, arg: any});
		}
		return this
	},
	addTransform: function(argument, name) {
		var transforms = this._ops;
		if ((name[0] !== 'u' || name[1] !== 'p') && typeof ncProto[name] === 'function') { //methodCall, exclude /^up.*/
			transforms.push({fcn: ncProto[name], arg: argument});
		}
		else if (name === 'defaults') transforms.unshift({fcn: ncProto.assign, arg: argument});
		else transforms.push({fcn: ncProto.assign, arg: [name, argument]});
		return transforms
	}
};

/**
 * @constructor
 * @param {!Object} template
 * @param {Object} [options]
 */
function List(template, options) {
	this._template = template;
	this._items = {};
	this.head = D.createComment('^');
	this.foot = D.createComment('$');
	this.assign(options);
	this.head[picoKey] = this.update ? this : null;
}

List.prototype = {
	constructor: List,
	state: null,
	store: null,
	assign: assignToThis,

	/**
	* @function moveTo
	* @param  {Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				next = this.head,
				origin = next.parentNode,
				target = parent.node || parent,
				cursor = before || null;
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
	update: updateListChildren,
	updateChildren: updateListChildren,
	_placeItem: function(parent, item, spot) {
		return item.node ? insertChild(parent, item.node, spot)
		: item.head ? insertList(parent, item, spot).foot
		: insertChild(parent, item, spot)
	},
	_initChild: function(model, key) {
		return model.cloneNode ? model.cloneNode(true)
		: model.defaults({store: this.store, state: this.state, key: key}).create()
	}
};

function updateListChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this._updateChildren(v,k,o);

	while (spot !== foot) {
		var next = spot.nextSibling;
		parent.removeChild(spot);
		spot = next;
	}
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
	var head = list.head;
	if (head === spot.nextSibling) parent.removeChild(spot); // later cleared or re-inserted
	else if (head !== spot) list.moveTo(parent, spot);
	return list
}

/**
 * @constructor
 * @this {List}
 * @param {!Object} template
 * @param {Object} [options]
 */
function ListK(template, options) {
	List.call(this, template, options);
}

ListK.prototype = Object.create(List.prototype, {
	getKey: {
		value: function(v,k) { return k }, // default: indexed
		writable: true
	},
	_updateChildren: {value: function(arr) {
		var spot = this.head.nextSibling,
				parent = spot.parentNode,
				items = this._items,
				newM = {};
		for (var i=0; i<arr.length; ++i) {
			var key = this.getKey(arr[i], i, arr);
			var item = newM[key] = items[key] || this._initChild(this._template, key);
			if (item) {
				if (item.update) item.update(arr[i], i, arr);
				spot = this._placeItem(parent, item, spot).nextSibling;
			}
		}

		this._items = newM;
		return spot
	}}
});

/**
 * @constructor
 * @this {List}
 * @param {!Object} template
 * @param {Object} [options]
 */
function ListS(template, options) {
	List.call(this, template, options);

	for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
		this._items[ks[i]] = this._initChild(template[ks[i]], ks[i]);
	}
}


ListS.prototype = Object.create(List.prototype, {
	select: {
		/**
		 * select all by default
		 * @function
		 * @param {...*} [v]
		 * @return {!Array}
		 */
		value: function(v) { return Object.keys(this._items) }, //eslint-disable-line no-unused-vars
		writable: true
	},
	_updateChildren: {value: function(v,k,o) {
		var spot = this.head.nextSibling,
				parent = spot.parentNode,
				items = this._items,
				keys = this.select(v,k,o);

		for (var i=0; i<keys.length; ++i) {
			var item = items[keys[i]];
			if (item) {
				if (item.update) item.update(v,k,o);
				spot = this._placeItem(parent, item, spot).nextSibling;
			}
		}

		return spot
	}}
});

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


lmProto.config = function(config) {
	return (new ListModel(this._template, this))._config(config)
};


lmProto.assign = function(key, val) {
	return (new ListModel(this._template, this))._assign(key, val)
};


lmProto.defaults = function(key, val) {
	return new ListModel(this._template,
		this._assign.call(
			val === undefined ? this._assign.call({}, key) : {key: val},
			this
		)
	)
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
	var model = new NodeModel(D.createElementNS(svgURI, tag));
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
	var model = new NodeModel(D.createElement(tagName));
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
 * @param {Node|Object} model source node or template
 * @param {...*} [options] options
 * @return {!Object} Component
 */
function template(model, options) { //eslint-disable-line no-unused-vars
	var modl = new NodeModel(createNode(model));
	for (var i=1; i<arguments.length; ++i) modl._config(arguments[i]);
	return modl
}

function view(model, target, store) {
	return (store ? model.defaults({store: store}) : model).create().moveTo(target)
}

function createNode(model) {
	if (model.cloneNode) return model.cloneNode(true)
	if (typeof model === 'number' || typeof model === 'string') return D.createTextNode('' + model)
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
	svg('svg', {
		attrs: {
			fill: '#000000',
			height: '24',
			viewBox: '0 0 24 24',
			width: '24'
		}},
		svg('path', {
			attrs: {
				d: 'M0 0h24v24H0z',
				fill: 'none'
			}}
		)
	)
);

var ic_add = ic_circle.config( //ic_add_circle_outline_black_36px
	svg('path', {attrs: {
		d: 'M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
	}})
);

var ic_clear = ic_circle.config( //ic_clear_black_36px
	svg('path', {attrs: {
		d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
	}})
);

var ic_remove = ic_circle.config( //ic_remove_circle_outline_black_36px
	svg('path', {attrs: {
		d: 'M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
	}})
);

var tableTemplate = element('table',
	element('tbody',
		list(
			element('tr',
				{class: 'abc'},
				function(tr) { tr.state = {i: tr.key}; },
				element('td', ic_remove, {
					on: {click: function() { this.store.delRow(this.state.i);}}
				}), // title column
				list( // data columns
					element('td',
						function(td) { td.state.j = td.key; },
						element('input',
							function(c) { c.i = c.state.i; c.j = c.state.j; },
							{
								update: function(val) { this.node.value = val; },
								on: {
									change: function() { this.store.set(this.node.value, [this.i, this.j]); }
								}
							}
						)
					)
				)
			)
		),
		element('tr',
			element('td', ic_add, {
				on: {
					click: function() { this.store.addRow(); }
				}
			})
		)
	)
);

var store = new Store([]);
var table = view(tableTemplate, document.body, store);

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