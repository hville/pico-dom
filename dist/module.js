/* hugov@runbox.com | https://github.com/hville/pico-dom.git | license:MIT */
var defaultView = typeof window !== 'undefined' ? window : void 0;
function setDefaultView(win) {
	if (win) defaultView = win;
	return defaultView
}

var namespaces = {
	html: 'http://www.w3.org/1999/xhtml',
	svg:  'http://www.w3.org/2000/svg'
};

/**
* @function fragment
* @return {!Object} documentFragment
*/
function createDocumentFragment() {
	return defaultView.document.createDocumentFragment()
}

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
			var options = assignOpts({}, defaults),
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
				if (cKind(arg) === Object) assignOpts(options, arg);
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

function reduce(obj, fcn, res, ctx) {
	for (var i=0, ks=Object.keys(obj); i<ks.length; ++i) res = fcn.call(ctx, res, obj[ks[i]], ks[i], obj);
	return res
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
	if (!extra && Extra) nodeExtra.set(item, new Extra(item));
	return extra
}
function setExtra(node, extra) {
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
	if (extra) for (var i=0, ks=Object.keys(extra); i<ks.length; ++i) this[ks[i]] = extra[ks[i]];
	if (key !== void 0) this.key = key;

	// register and init
	this.node = node;
	setExtra(node, this);
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
			var extra = getExtra(last);
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
		var extra = getExtra(ptr);
		if (extra) {
			extra.update.apply(extra, arguments);
			ptr = (extra.footer || ptr).nextSibling;
		}
		else ptr = ptr.nextSibling;
	}
	return this
}

function Pick(path) {
	this.path = path;
}
function pick() {
	return new Pick(Array.apply(null, arguments))
}

Pick.of = Pick['fantasy-land/of'] = pick;

Pick.prototype = {
	constructor: Pick,
	get value() {
		return
	},
	key: map,
	map: map,
	apply: function apply(obj) {
		var value = obj,
				path = this.path;
		for (var i=0; i<path.length; ++i) {
			var step = path[i];
			if (value.hasOwnProperty(step)) value = value[step];     // key
			else if (typeof key === 'function') value = step(value); // map
			// value = step.value(value)  // ap
			// value = step(value).value  // chain
			else return
		}
		return value
	},
	ap: function ap(pick) {
		return new Pick(this.path.concat(pick.path))
	},
	chain: function chain(f) {
		return f(this.path)
	}
};
function map() {
	return new Pick(this.path.concat.apply(this.path, arguments))
}

var decorators = {
	attrs: function(elm, obj) {
		return obj ? reduce(obj, setAttr, elm) : elm
	},
	props: function(elm, obj) {
		return obj ? reduce(obj, setProp, elm) : elm
	},
	children: function(elm, arr) {
		return arr ? arr.reduce(setChild, elm, setChild) : elm
	},
	extra: function(elm, obj) {
		return obj ? reduce(obj, setExtra, elm) : elm
	}
};
/*
	TODO for children, autoUpdate setChild => replaceChild
*/
function setAttr(elm, val, key) {
	if (val instanceof Pick) return setComponent(setAttr, elm, val, key)

	if (val === false) elm.removeAttribute(key);
	else elm.setAttribute(key, val === true ? '' : val);
	return elm
}
function setProp(elm, val, key) {
	if (val instanceof Pick) return setComponent(setProp, elm, val, key)

	if (elm[key] !== val) elm[key] = val;
	return elm
}

function setChild(elm, itm) {
	if (itm instanceof Pick) throw Error('childCursor not supported')
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

function setComponent(dec, elm, cur, key) {
	var extra = getExtra(elm, Component);
	extra.updaters.push({fcn:dec, cur:cur, key:key});
	return dec(elm, cur.value(), key)
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
	if (children) decorators.children(element, children);
	return element
}

var presetElement = creator(decorate);

var createElement = presetElement();
createElement.svg = presetElement({xmlns: namespaces.svg});
createElement.preset = presetElement;

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

	// lookup maps to locate existing component and delete extra ones
	this.mapKC = new Map(); // dataKey => component, for updating
	this.factory = factory;

	//required to keep parent ref when no children.length === 0
	this.header = createComment('^');
	this.footer = createComment('$');
	setExtra(this.header, this);
	setExtra(this.footer, this);
}
List.prototype = {
	constructor: List,
	dataKey: function dataKey(v,i) { return i },
	update: updateChildren$1,
	updateChildren: updateChildren$1,

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

			var ctx = getExtra(item);
			if (ctx) ctx.moveTo(parent, before);
			else parent.insertBefore(item, before);
		}
		parent.insertBefore(foot, before);

		return this
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
			var extra = getExtra(drop);
			mapKC.delete(extra.key);
			extra.moveTo(null);
		}
		return this
	}
};

/**
* @function updateChildren
* @param  {Array} arr array of values to update
* @param  {...*} optional update arguments
* @return {!List} list instance
*/
function updateChildren$1(arr) {
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
}

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
function createList(model, dataKey) {
	switch (model.constructor) {
		case Function:
			return new List(model, dataKey)
		case Component: case List:
			return new List(createFactory(model), dataKey)
		default:
			throw Error('invalid list model:' + typeof model)
	}
}

// DOM

export { setDefaultView, namespaces, createDocumentFragment, createComment, createTextNode, createElement, getNode, getExtra, createComponent, createList, pick };
