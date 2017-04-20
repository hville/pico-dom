/* hugov@runbox.com | https://github.com/hville/pico-dom.git | license:MIT */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var defaultView = typeof window !== 'undefined' ? window : void 0;
function setDefaultView(win) {
	if (win) defaultView = win;
	return defaultView
}

var namespaces = {
	html: 'http://www.w3.org/1999/xhtml',
	svg:  'http://www.w3.org/2000/svg'
};

//import {Lens} from '../constructors/lens'
//import {List} from '../constructors/list'
//import {Extras} from '../constructors/extras'
//import {getExtra} from '../extras'
//import {cKind} from './c-kind'
//import {createTextNode, createComment} from '../create-node'
//import {moveNode} from './move-node'
// GENERAL

function assignKey(tgt, val, key) {
	if (typeof val === 'object') tgt[key] = assign(tgt[key] || {}, val);
	else if (tgt[key] !== val) tgt[key] = val;
	return tgt
}

function setProperty(obj, val, key) {
	if (obj[key] !== val) obj[key] = val;
	return obj
}

// NODE



// ELEMENT

function setAttribute(elm, val, key) {
	if (val === false) elm.removeAttribute(key);
	else elm.setAttribute(key, val === true ? '' : val);
	return elm
}


/*export function appendChild(elm, itm) {
	if (itm instanceof Lens) {
		var child = elm.appendChild(createComment('?'))
		return setEdit(replaceChild, elm, itm, child)
	}
	switch(cKind(itm)) {
		case null: case undefined:
			elm.appendChild(createComment(''+itm))
			return elm
		case Array:
			//return itm.reduce(appendChild, elm)??? TODO List
			throw Error('not yet supported. TODO')
		case Number:
			elm.appendChild(createTextNode(''+itm))
			return elm
		case String:
			elm.appendChild(createTextNode(itm))
			return elm
		case List:
			itm.moveList(elm)
			return elm
		default:
			elm.appendChild(itm)
			return elm
	}
}*/

/*export function replaceChild(elm, itm, oldChild) {
	if (itm instanceof Lens) {
		return setEdit(replaceChild, elm, itm, oldChild)
	}
	switch(cKind(itm)) {
		case null: case undefined:
			this.key = elm.replaceChild(createComment(''+itm), oldChild)
			return elm
		case Array:
			//return itm.reduce(appendChild, elm)??? TODO List
			//for (var i=0; i<itm.length; ++i) elm.insertBefore()
			//return itm.reduce(replaceChild, elm, ???)
			throw Error('not yet supported. TODO')
		case Number:
			this.key = elm.replaceChild(createTextNode(''+itm), oldChild)
			return elm
		case String:
			this.key = elm.replaceChild(createTextNode(itm), oldChild)
			return elm
		case List:
			itm.moveList(elm, oldChild)
			moveNode(oldChild, null)
			return elm
		default:
			this.key = elm.replaceChild(itm, oldChild)
			return elm
	}
}*/

// EXTRA

/*export function setState(elm, val, key) {
	var extras = getExtra(elm, Extras),
			state = extras.state || (extras.state = {})
	if (val instanceof Lens) return setEdit(setState, elm, val, key)
	if (state[key] !== val) state[key] = val
	return elm
}*/

function reduce(obj, fcn, res, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) res = fcn.call(ctx, res, obj[ks[i]], ks[i], obj);
	return res
}

function assign(tgt, src) {
	return src ? reduce(src, setProperty, tgt) : tgt
}

function assignKeys(tgt, src) {
	return src ? reduce(src, assignKey, tgt) : tgt
}

function cKind(t) {
	return t == null ? t //eslint-disable-line eqeqeq
		: t.constructor || Object
}

var rRE =/[\"\']+/g;
var mRE = /(?:^|\.|\#)[^\.\#\[]+|\[[^\]]+\]/g;

function creator(factory) {
	return function(defaults) {
		return function define(selector) {
			// Options precedence: defaults < selector < options[0] < options[1] ...
			var options = assignKeys({}, defaults),
					content = [],
					elem = null;

			// selector handling
			if (typeof selector === 'string') {
				var	matches = selector.replace(rRE, '').match(mRE);
				if (!matches) throw Error('invalid selector: '+selector)
				matches.reduce(parse, options);
				var doc = defaultView.document,
						tag = options.tagName || 'div',
						xns = options.xmlns;
				elem = xns ? doc.createElementNS(xns, tag) : doc.createElement(tag);
			}
			else {
				elem = selector;
			}

			// options and children
			for (var i=1; i<arguments.length; ++i) {
				var arg = arguments[i];
				if (cKind(arg) === Object) assignKeys(options, arg);
				else content.push(arg);
			}
			return factory(elem, options, content)
		}
	}
}
function parse(def, txt) {
	var idx = -1,
			key = '';
	if (!def.attrs) def.attrs = {};
	switch (txt[0]) {
		case '[':
			idx = txt.indexOf('=');
			key = txt.slice(1, idx);
			if (idx === -1) def.attrs[key] = true;
			else if (idx === txt.length-2) def.attrs[key] = false;
			else {
				var val = txt.slice(idx+1, -1);
				if (key === 'xmlns') def.xmlns = val;
				else def.attrs[key] = val;
			}
			break
		case '.':
			key = txt.slice(1);
			if (def.attrs.class) def.attrs.class += ' ' + key;
			else def.attrs.class = key;
			break
		case '#':
			def.attrs.id = txt.slice(1);
			break
		default:
			idx = txt.indexOf(':');
			if (idx === -1) def.tagName = txt;
			else {
				def.tagName = txt.slice(idx+1);
				def.xmlns = namespaces[txt.slice(0,idx)];
			}
	}
	return def
}

var counter = 0;

function PunyMap() {
	// unique key to avoid clashes between instances and other properties
	this._key = '_wMap' + String.fromCodePoint(Date.now()<<8>>>16) + (counter++).toString(36);
}
PunyMap.prototype.get = function get(objectKey) {
	return objectKey[this._key]
};
PunyMap.prototype.set = function set(objectKey, val) {
	objectKey[this._key] = val;
	return this
};

var nodeExtra = typeof WeakMap !== 'undefined' ? new WeakMap : new PunyMap;

function getNode(item) {
	return item ? item.node || item : void 0
}
/**
* @function getExtra
* @param  {!Object} item node or extra
* @param  {Function} [Extra] creates an instance if not existign
* @return {Object} the extra node context
*/
function getExtra(item, Extra) {
	if (!item) return void 0
	var extra = item.node ? item : nodeExtra.get(item);
	if (!extra && Extra) {
		extra = new Extra(item);
		nodeExtra.set(item, extra);
	}
	return extra
}
function setExtra$1(node, extra) {
	nodeExtra.set(node, extra);
	return node
}

function cloneChildren(targetParent, sourceChild) {
	if (sourceChild === null) return targetParent
	var	sourceItem = getExtra(sourceChild),
			sourceNext = sourceChild.nextSibling;
	if (!sourceItem) {
		targetParent.appendChild(cloneChildren(sourceChild.cloneNode(false), sourceChild.firstChild));
	}
	else {
		sourceItem.clone().moveTo(targetParent);
		if (sourceItem.factory) sourceNext = sourceItem.footer.nextSibling;
	}
	return cloneChildren(targetParent, sourceNext)
}

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {*} [key] - optional data key
 * @param {number} [idx] - optional position index
 */
function Component(node, extra, key, idx) {
	//decorate: key, init, update, onmove, handleEvents...
	if (extra) reduce(extra, setProperty, this);
	if (key !== void 0) this.key = key;

	// register and init
	this.node = node;
	setExtra$1(node, this);
	if (this.init) this.init(key, idx);
}

Component.prototype = {
	constructor: Component,

	/**
	* @function clone
	* @param {*} [key] - optional key
	* @param {number} [idx] - optional position index
	* @return {!Component} new Component
	*/
	clone: function clone(key, idx) {
		var sourceNode = this.node,
				targetNode = sourceNode.cloneNode(false);
		cloneChildren(targetNode, sourceNode.firstChild);
		return new Component(targetNode, this, key, idx)
	},

	update: updateChildren,
	updateChildren: updateChildren,

	/**
	* @function moveTo
	* @param  {Object} parent parentNode
	* @param  {Object} [before] nextSibling
	* @return {!Component} this
	*/
	moveTo: function moveTo(parent, before) {
		var node = this.node,
				oldParent = node.parentNode;
		if (parent) parent.insertBefore(node, before || null);
		else if (oldParent) oldParent.removeChild(node);
		if (this.onmove) this.onmove(oldParent, parent);
		return this
	}
};

/**
* @function updateChildren
* @param  {...*} optional arguments
* @return {!Component} list instance
*/
function updateChildren() {
	var ptr = this.node.firstChild;
	while (ptr) {
		var extra = getExtra(ptr);
		if (extra) {
			extra.update.apply(extra, arguments);
			ptr = (extra.footer || ptr).nextSibling;
		}
		else ptr = ptr.nextSibling;
	}
	return this
}

/*
map:   (this:La, ( a => b)) => Lb // L(path.concat( a=>b ))         map(fcn)
ap:    (this:La, L(a => b)) => Lb // L(path.concat(L(a=>b).path))   ap(lens)
chain: (this:La, (a => Lb)) => Lb // L(path.concat((a=>Lb).value))  chain(lens.of) //no need
*/

function createLens(path, post, data) {
	return new Lens(
		Array.isArray(path) ? path : path != null ? [path] : [], //eslint-disable-line eqeqeq
		post,
		data
	)
}

function Lens(path, post, data) {
	this.path = path;
	this.post = post;
	this.data = data;
}

Lens.of = createLens;

Lens.prototype = {
	constructor: Lens,
	get key() {
		return this.path[this.path.length - 1] //TODO fail on fcn
	},
	get: map,
	map: map,
	set: function(val) {
		this.post(this.path, val);
	},
	default: function() {
		return this.value(this.data)
	},
	value: function value(obj) {
		var val = obj,
				path = this.path;
		for (var i=0; i<path.length; ++i) {
			var step = path[i];
			if (val.hasOwnProperty(step)) val = val[step];       // key
			else if (typeof key === 'function') val = step(val); // map //TODO step(val, key)
			// value = step.value(value)  // ap
			// value = step(value).value  // chain
			else return
		}
		return val
	},
	ap: function ap(lens) {
		return new Lens(this.path.concat(lens.path), this.post, this.data)
	}
};

function map() {
	var path = this.path;
	return new Lens(path.concat.apply(path, arguments), this.post, this.data)
}

var decorators = {
	attrs: function(elm, obj) {
		return obj ? reduce(obj, parseValue, elm, setAttribute) : elm
	},
	props: function(elm, obj) {
		return obj ? reduce(obj, parseValue, elm, setProperty) : elm
	},
	children: function(elm, arr) {
		return arr ? reduce(arr, parseValue, elm, setChild) : elm
	},
	extra: function(elm, obj) {
		return obj ? reduce(obj, setExtra$$1, elm) : elm
	}
	/*state: function(elm, obj) {
		return obj ? reduce(obj, parseValue, elm, setState) : elm
	}*/
};
function parseValue(elm, val, key) {
	var fcn = this;
	if (val instanceof Lens) return setEdit(fcn, elm, val, key)
	else return fcn(elm, val, key)
}
/*
	TODO for children, autoUpdate setChild => replaceChild
*/
function setExtra$$1(elm, val, key) {
	if (val instanceof Lens) return setEdit(setExtra$$1, elm, val, key)
	var extras = getExtra(elm, Component);
	extras[key] = val;
	return elm
}

function setChild(elm, itm) {
	if (itm instanceof Lens) throw Error('childCursor not supported')
	switch(cKind(itm)) {
		case null: case undefined:
			return elm
		case Array:
			return itm.reduce(setChild, elm)
		case Number:
			elm.appendChild(createTextNode(''+itm));
			return elm
		case String:
			elm.appendChild(createTextNode(itm));
			return elm
		default:
			if (itm.moveTo) itm.moveTo(elm);
			else elm.appendChild(getNode(itm));
			return elm
	}
}

function setEdit(dec, elm, cur, key) {
	var extra = getExtra(elm, Component);
	extra.updaters.push({fcn:dec, cur:cur, key:key});
	return dec(elm, cur.value(), key)
}
/*
function setEdit(red, elm, lens, key) {
	getExtra(elm, Extras).edits.push({red: red, get:lens, key:key}) //TODO replace changes the key...
	//if (lens.data) red(elm, lens.default, key) //TODO remove?
	return elm
}
*/

/**
 * Parse a CSS-style selector string and return a new Element
 * @param {!Object} element - element to be decorated
 * @param {Object} config - The existing definition to be augmented
 * @param {Array} [children] - Element children Nodes,Factory,Text
 * @returns {!Object} - The parsed element definition [sel,att]
 */
function decorate(element, config, children) {
	reduce(config, run, element);
	if (children) decorators.children(element, children);
	return element
}
function run(elm, val, key) {
	return decorators[key] ? decorators[key](elm, val) : elm
}

var presetElement = creator(decorate);

var createElement = presetElement();
createElement.svg = presetElement({xmlns: namespaces.svg});
createElement.preset = presetElement;

/**
* @function comment
* @param  {string} string commentNode data
* @return {!Object} commentNode
*/
function createComment(string) {
	return defaultView.document.createComment(string)
}

/**
* @function text
* @param  {string} string textNode data
* @return {!Object} textNode
*/
function createTextNode(string) {
	return defaultView.document.createTextNode(string)
}

/**
* @function fragment
* @return {!Object} documentFragment
*/
function createDocumentFragment() {
	return defaultView.document.createDocumentFragment()
}

function replaceChildren(parent, childIterator, after, before) {
	var ctx = {
		parent: parent,
		cursor: after ? after.nextSibling : parent.firstChild,
		before: before || null
	};

	// insert new children or re-insert existing
	if (childIterator) {
		childIterator.forEach(insertNewChild, ctx);
	}

	// remove orphans
	var cursor = ctx.cursor;
	while (cursor != before) { //eslint-disable-line eqeqeq
		var next = cursor.nextSibling;
		parent.removeChild(cursor);
		cursor = next;
	}
	return parent
}
function insertNewChild(newChild) {
	var parent = this.parent,
			cursor = this.cursor,
			before = this.before;
	// no existing children, just append
	if (cursor === null) parent.appendChild(newChild);
	// right position, move on
	else if (newChild === cursor) this.cursor = cursor.nextSibling;
	// likely deletion, possible reshuffle. move oldChild to end
	else if (newChild === cursor.nextSibling) {
		parent.insertBefore(cursor, before);
		this.cursor = newChild.nextSibling;
	}
	// insert newChild before oldChild
	else parent.insertBefore(newChild, cursor);
}

/**
* @function preset
* @param  {Object} defaults preloaded component defaults
* @return {Function(string|Object, ...*):!Component} component hyperscript function
*/
var preset = creator(function(elm, cfg, cnt) {
	return new Component(decorate(elm, cfg, cnt), cfg.extra, cfg.input)
});

var createComponent = preset();
createComponent.svg = preset({xmlns: namespaces.svg});
createComponent.preset = preset;

/**
 * @constructor
 * @param {Function} factory - component generating function
 * @param {*} dKey - data key
 */
function List(factory, dKey) {
	if (dKey !== undefined) {
		this.dataKey = typeof dKey === 'function' ? dKey : function(v) { return v[dKey] };
	}
	this.data = [];
	// lookup maps to locate existing component and delete extra ones
	this.mapKN = {}; // dataKey => component, for updating
	this.factory = factory;

	//required to keep parent ref when no children.length === 0
	this.header = createComment('^');
	this.footer = createComment('$');
	setExtra$1(this.header, this);
	setExtra$1(this.footer, this);
}
List.prototype = {
	constructor: List,
	dataKey: function dataKey(v,i) { return i },

	forEach: function forEach(fcn, ctx) {
		var data = this.data;

		fcn.call(ctx, this.header);
		for (var i=0; i<data.length; ++i) {
			var key = this.dataKey(data[i], i, data);
			fcn.call(ctx, this.mapKN[key], key);
		}
		fcn.call(ctx, this.footer);
	},

	/**
	* @function clone
	* @return {!List} new List
	*/
	clone: function clone() {
		return new List(this.factory, this.dataKey)
	},

	/**
	* @function moveTo
	* @param  {Object} parent parentNode
	* @param  {Object} [before] nextSibling
	* @return {!List} this
	*/
	moveTo: function moveTo(parent, before) {
		var foot = this.footer,
				head = this.header,
				origin = head.parentNode;
		// skip case where there is nothing to do
		if ((origin || parent) && before !== foot && (origin !== parent || before !== foot.nextSibling)) {
			// newParent == null -> remove only
			if (!parent) replaceChildren(origin, null, head.previousSibling, foot.nextSibling);
			else replaceChildren(parent, this, before || parent.lastChild, before);
		}
		return this //TODO check return value|type
	},

	/**
	* @function update
	* @param  {Array} arr array of values to update
	* @return {!List} list instance
	*/
	update: function update(arr) {
		var oldKN = this.mapKN,
				newKN = this.mapKN = {},
				getK = this.dataKey;
		//TODO simplify index keys

		// update the node keyed map
		this.data = arr;
		for (var i=0; i<arr.length; ++i) {
			var val = arr[i],
					key = getK(val, i, arr);
			// find item, create Item if it does not exits
			var node = newKN[key] = oldKN[key] || this.factory(key, i),
					extra = getExtra(node);
			if (extra) extra.update(val, i, arr);
		}

		// update the view
		var head = this.header,
				foot = this.footer,
				parent = head.parentNode;
		if (!parent) return this //TODO check return value|type
		replaceChildren(parent, this, head && head.previousSibling, foot && foot.nextSibling);
	}
};

function cloneNode(node, key, idx) {
	var copy = node.cloneNode(false),
			extra = getExtra(node);

	// copy DOM nodes before extra behaviour
	var nodeChild = node.firstChild;
	while(nodeChild) {
		copy.appendChild(cloneNode(nodeChild));
		nodeChild = nodeChild.nextSibling;
	}

	if (extra) {
		if (extra.header) new List(extra.factory, extra.dataKey);
		else new Component(copy, extra, key, idx);
	}
	return copy
}

function createFactory(instance) {
	return function(k, i) {
		var comp = instance.clone(k, i);
		return comp.node || comp
	}
}

/**
* @function list
* @param  {List|Component|Function} model list or component factory or instance to be cloned
* @param  {Function|string|number} [dataKey] record identifier
* @return {!List} new List
*/
/**
* @function list
* @param  {List|Node|Function} model list or component factory or instance to be cloned
* @param  {Function|string|number} [dataKey] record identifier
* @return {!List} new List
*/
function createList(model, dataKey) {
	switch (model.constructor) {
		case Function:
			return new List(model, dataKey)
		case Component: case List:
			return new List(createFactory(model), dataKey)
		default:
			if (model.cloneNode) return new List(function() { return model.cloneNode(true) }, dataKey ) //TODO use cloneNode(node) to get components in tree
			throw Error('invalid list model:' + typeof model)
	}
}

function updateNode(node, v,k,o) {
	var extra = getExtra(node);
	if (extra && extra.update) extra.update.call(node, v,k,o);
	return node
}


/*
export function updateNode(node, v,k,o) {
	var extra = getExtra(node)
	if (extra) {
		if (extra.edits) for (var i=0; i<extra.edits.length; ++i) {
			var edit = extra.edits[i]
			node = edit.red(node, edit.get.value(v), edit.key)
		}
		if (extra.footer) return extra.footer
	}
	var child = node.firstChild
	while (child) child = updateNode(child, v,k,o).nextSibling
	return node
}

*/

// DOM

exports.setDefaultView = setDefaultView;
exports.namespaces = namespaces;
exports.createElement = createElement;
exports.createComment = createComment;
exports.createTextNode = createTextNode;
exports.createDocumentFragment = createDocumentFragment;
exports.replaceChildren = replaceChildren;
exports.getNode = getNode;
exports.getExtra = getExtra;
exports.createComponent = createComponent;
exports.createList = createList;
exports.createLens = createLens;
exports.cloneNode = cloneNode;
exports.updateNode = updateNode;
