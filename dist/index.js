/* hugov@runbox.com | https://github.com/hville/pico-dom.git | license:MIT */
'use strict';

var ENV$1 = {
	get document() { return init().document },
	get window() { return init().window },
	set window(win) { setWindow(win); },
};
function init() {
	if (typeof window !== 'undefined') return setWindow(window)
	throw Error('undefined window global (global or module property)')
}
function setWindow(win) {
	return Object.defineProperties(ENV$1, {
		document: {value: win.document},
		window: {value: win}
	})
}

var ns = {
	html: 'http://www.w3.org/1999/xhtml',
	svg:  'http://www.w3.org/2000/svg'
};

/**
* @function text
* @param  {string} string textNode data
* @return {!Object} textNode
*/
function text(string) {
	return ENV$1.document.createTextNode(string)
}

/**
* @function fragment
* @return {!Object} documentFragment
*/
function fragment() {
	return ENV$1.document.createDocumentFragment()
}

/**
* @function comment
* @param  {string} string commentNode data
* @return {!Object} commentNode
*/
function comment(string) {
	return ENV$1.document.createComment(string)
}

function reduce(obj, fcn, res, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) res = fcn.call(ctx, res, obj[ks[i]], ks[i], obj);
	return res
}

var decorators = {
	attrs: function(elm, val) {
		return val ? reduce(val, setAttr, elm) : elm
	},
	props: function(elm, val) {
		return val ? reduce(val, setProp, elm) : elm
	}
};
function setAttr(elm, val, key) {
	if (val === false) elm.removeAttribute(key);
	else elm.setAttribute(key, val === true ? '' : val);
	return elm
}
function setProp(elm, val, key) {
	if (elm[key] !== val) elm[key] = val;
	return elm
}

function assignOpts(tgt, src) {
	if (src) for (var i=0, ks=Object.keys(src); i<ks.length; ++i) {
		var opt = ks[i];
		switch (opt) {
			case 'xmlns': case 'input':
				tgt[opt] = src[opt];
				break
			case 'attrs': case 'props': case 'extra':
				if (!tgt[opt]) tgt[opt] = {};
				var si = src[opt];
				for (var j=0, kss=Object.keys(si); j<kss.length; ++j) tgt[opt][kss[j]] = si[kss[j]];
		}
	}
	return tgt
}

var rRE =/[\"\']+/g;
var mRE = /(?:^|\.|\#)[^\.\#\[]+|\[[^\]]+\]/g;

function creator(factory) {
	return function(defaults) {
		return function define(selector) {
			// Options precedence: defaults < selector < options[0] < options[1] ...
			var options = assignOpts({}, defaults),
					content = [],
					elem = null;

			// selector handling
			if (typeof selector === 'string') {
				var	matches = selector.replace(rRE, '').match(mRE);
				if (!matches) throw Error('invalid selector: '+selector)
				matches.reduce(parse, options);
				var doc = ENV$1.document,
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
				if (arg && arg.constructor === Object) assignOpts(options, arg);
				else mergeChildren.call(content, arg);
			}
			return factory(elem, options, content)
		}
	}
}
function mergeChildren(arg) {
	if (arg != null) switch(ctyp(arg)) { //eslint-disable-line eqeqeq
		case Array:
			arg.forEach(mergeChildren, this);
			break
		case Number:
			this.push(text(''+arg));
			break
		case String:
			this.push(text(arg));
			break
		default: this.push(arg);
	}
}
function ctyp(t) {
	return t == null ? t //eslint-disable-line eqeqeq
		: t.constructor || Object
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
				def.xmlns = ns[txt.slice(0,idx)];
			}
	}
	return def
}

/**
 * Parse a CSS-style selector string and return a new Element
 * @param {!Object} element - element to be decorated
 * @param {Object} config - The existing definition to be augmented
 * @param {Array} [children] - Element children Nodes,Factory,Text
 * @returns {!Object} - The parsed element definition [sel,att]
 */
function decorate(element, config, children) {
	// properties and attributes
	for (var i=0, ks=Object.keys(decorators); i<ks.length; ++i) {
		var key = ks[i],
				val = config[key];
		if (val) decorators[key](element, val);
	}
	// children
	for (var j=0; j<children.length; ++j) {
		var child = children[j];
		if (child.moveTo) child.moveTo(element);
		else element.appendChild(child);
	}
	return element
}

var preset = creator(decorate);

var el = preset();
el.svg = preset({xmlns: ns.svg});
el.preset = preset;

var EXTRA = typeof WeakMap !== 'undefined' ? new WeakMap() : {
	set: function(node, comp) { node._$comp_ = comp; },
	get: function(node) { return node._$comp_ }
};

function cloneChildren(targetParent, sourceChild) {
	if (sourceChild === null) return targetParent
	var	sourceItem = EXTRA.get(sourceChild),
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
function Component$1(node, extra, key, idx) {
	//decorate: key, init, update, onmove, handleEvents...
	if (extra) for (var i=0, ks=Object.keys(extra); i<ks.length; ++i) this[ks[i]] = extra[ks[i]];
	if (key !== void 0) this.key = key;

	// register and init
	this.node = node;
	EXTRA.set(node, this);
	if (this.init) this.init(key, idx);
}

Component$1.prototype = {
	constructor: Component$1,

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
		return new Component$1(targetNode, this, key, idx)
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
	},

	/**
	* @function setText
	* @param  {string} text textNode data
	* @return {!Component} this
	*/
	setText: function setText(text) {
		var node = this.node,
				child = node.firstChild;
		if (child && !child.nextSibling && child.nodeValue !== text) child.nodeValue = text;
		else node.textContent = text;
		return this
	},

	/**
	* @function removeChildren
	* @param  {Object} [after] optional last node to be kept
	* @return {!Component} this
	*/
	removeChildren: function removeChildren(after) {
		var last = parent.lastChild;

		while (last && last != after) { //eslint-disable-line eqeqeq
			var extra = EXTRA.get(last);
			if (extra) extra.moveTo(null);
			else parent.removeChild(last);
			last = parent.lastChild;
		}
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
		var extra = EXTRA.get(ptr);
		if (extra) {
			extra.update.apply(extra, arguments);
			ptr = (extra.footer || ptr).nextSibling;
		}
		else ptr = ptr.nextSibling;
	}
	return this
}

/**
* @function preset
* @param  {Object} defaults preloaded component defaults
* @return {Function(string|Object, ...*):!Component} component hyperscript function
*/
var preset$1 = creator(function(elm, cfg, cnt) {
	return new Component$1(decorate(elm, cfg, cnt), cfg.extra, cfg.input)
});

var co = preset$1();
co.svg = preset$1({xmlns: ns.svg});
co.preset = preset$1;

/**
 * @constructor
 * @param {Function} factory - component generating function
 * @param {*} dKey - data key
 */
function List$1(factory, dKey) {
	if (dKey !== undefined) {
		this.dataKey = typeof dKey === 'function' ? dKey : function(v) { return v[dKey] };
	}

	// lookup maps to locate existing component and delete extra ones
	this.mapKC = new Map(); // dataKey => component, for updating
	this.factory = factory;

	//required to keep parent ref when no children.length === 0
	this.header = comment('^');
	this.footer = comment('$');
	EXTRA.set(this.header, this);
	EXTRA.set(this.footer, this);
}
List$1.prototype = {
	constructor: List$1,
	dataKey: function dataKey(v,i) { return i },

	/**
	* @function clone
	* @return {!List} new List
	*/
	clone: function clone() {
		return new List$1(this.factory, this.dataKey)
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
				oldParent = head.parentNode;

		//nothing to do
		if (!oldParent && !parent) return this
		if ((oldParent === parent) && (before === foot || before === foot.nextSibling)) return this

		// list without parent are empty, just move the ends
		if (!oldParent) {
			parent.appendChild(head);
			parent.appendChild(foot);
			return this
		}

		// clear the list if dismounted (newParent === null)
		if (!parent) {
			this.removeChildren();
			oldParent.removeChild(head);
			oldParent.removeChild(foot);
			return this
		}

		// insert || append
		var next = head.nextSibling;
		if (!before) before = null;

		parent.insertBefore(head, before);
		while(next !== foot) {
			var item = next;
			next = item.nextSibling;

			var ctx = EXTRA.get(item);
			if (ctx) ctx.moveTo(parent, before);
			else parent.insertBefore(item, before);
		}
		parent.insertBefore(foot, before);

		return this
	},

	/**
	* @function update
	* @param  {Array} [arr] optional Element pointer
	* @return {!List} list instance
	*/
	update: function update(arr) {
		var head = this.header,
				foot = this.footer,
				parent = head.parentNode;
		if (!parent) throw Error('list.updates requires a parentNode')
		var mapKC = this.mapKC,
				getK = this.dataKey,
				before = head.nextSibling;

		for (var i=0; i<arr.length; ++i) {
			var val = arr[i],
					key = getK(val, i, arr);
			// find item, create Item if it does not exits
			var itm = mapKC.get(key);
			if (!itm) {
				itm = this.factory(key, i);
				if (itm.key !== key) itm.key = key;
				mapKC.set(key, itm);
				parent.insertBefore(itm.node, before); // new item: insertion
			}
			else if (itm.node === before) { // right position, move on
				before = itm.node.nextSibling;
			}
			else if (itm.node === before.nextSibling) { // likely deletion, possible reshuffle. move to end
				parent.insertBefore(before, foot);
				before = itm.node.nextSibling;
			}
			else {
				parent.insertBefore(itm.node, before); //move existing node back
			}
			if (itm.update) itm.update(val, i, arr);
		}

		// de-reference leftover items
		return this.removeChildren(before.previousSibling)
	},

	/**
	* @function removeChildren
	* @param  {Object} [after] optional Element pointer
	* @return {!List} list instance
	*/
	removeChildren: function removeChildren(after) {
		var foot = this.footer,
				parent = foot.parentNode;
		// list without parent are empty
		if (!parent) return this

		var mapKC = this.mapKC,
				stop = after || this.header,
				drop = foot;

		while ((drop = foot.previousSibling) !== stop) {
			var extra = EXTRA.get(drop);
			mapKC.delete(extra.key);
			extra.moveTo(null);
		}
		return this
	}
};

function createFactory(instance) {
	return function(k, i) {
		var comp = instance.clone(k, i);
		return comp
	}
}

/**
* @function list
* @param  {List|Component|Function} model list or component factory or instance to be cloned
* @param  {Function|string|number} [dataKey] record identifier
* @return {!List} new List
*/
function list(model, dataKey) {
	switch (model.constructor) {
		case Function:
			return new List$1(model, dataKey)
		case Component$1: case List$1:
			return new List$1(createFactory(model), dataKey)
		default:
			throw Error('invalid list model:' + typeof model)
	}
}

// DOM Items
ENV$1.namespaces = ns;
ENV$1.fragment = fragment;
ENV$1.text = text;
ENV$1.comment = comment;

// Element Items
ENV$1.decorators = decorators;
ENV$1.element = el;

// Component Items
ENV$1.extra = EXTRA;
ENV$1.Component = Component$1;
ENV$1.component = co;

// List
ENV$1.List = List$1;
ENV$1.list = list;

module.exports = ENV$1;
