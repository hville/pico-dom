/* hugov@runbox.com | https://github.com/hville/pico-dom.git | license:MIT */
(function (exports) {
'use strict';

var defaultView = typeof window !== 'undefined' ? window : void 0;

function setDefaultView(win) {
	if (win) defaultView = win;
	return defaultView
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

var extras = typeof WeakMap !== 'undefined' ? new WeakMap : new PunyMap; //TODO use extras directly

function cloneNode(node, deep) { //TODO change instanceof to List properties
	// components have their own logic
	var extra = extras.get(node);
	if (extra) return extra.clone(node, deep)

	// for plain elements
	var copy = node.cloneNode(false);
	return deep === false ? copy : cloneChildren(node, copy)
}

function cloneChildren(node, copy) {
	var childNode = node.firstChild;
	while(childNode) {
		var childCopy = cloneNode(childNode, true),
				nextNode = childCopy.nextSibling,
				extra = extras.get(childCopy);

		if (extra) extra.moveTo(childCopy, copy);
		else copy.appendChild(childCopy);

		childNode = nextNode;
	}
	return copy
}

function assign(target, source) {
	for (var i=0, ks=Object.keys(source); i<ks.length; ++i) target[ks[i]] = source[ks[i]];
	return target
}

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {*} [key] - optional data key
 * @param {number} [idx] - optional position index
 */
function Extra(node, extra) {
	extras.set(node, this);
	if (extra) assign(this, extra);
	//TODO init
}

var extraP = Extra.prototype;

extraP.patch = null;
extraP.init = null; //TODO

extraP.clone = function clone(node, deep) {
	var copy = node.cloneNode(false);
	// copy tree before creating initiating the new Extra
	if (deep !== false) cloneChildren(node, copy);
	new Extra(copy, this);
	return copy
};

extraP.update = function update(node, v,k,o) {
	if (this.patch) for (var i=0; i<this.patch.length; ++i) this.patch[i](node, v,k,o);
	return node
};

extraP.moveTo = function moveTo(node, parent, before) {
	var oldParent = node.parentNode;
	if (parent) parent.insertBefore(node, before || null);
	else if (oldParent) oldParent.removeChild(node);
	if (this.onmove) this.onmove(oldParent, parent);
	return this
};

/*
map:   (this:La, ( a => b)) => Lb // L(path.concat( a=>b ))         map(fcn)
ap:    (this:La, L(a => b)) => Lb // L(path.concat(L(a=>b).path))   ap(lens)
chain: (this:La, (a => Lb)) => Lb // L(path.concat((a=>Lb).value))  chain(lens.of) //no need
*/

function createLens(set, key) {
	return new Lens(set, Array.isArray(key) ? key : key != null ? [key] : []) //eslint-disable-line eqeqeq
}

function Lens(set, path) {
	this.set = set;
	this.path = path || [];
}

Lens.of = createLens;

Lens.prototype = {
	constructor: Lens,
	get key() {
		return this.path[this.path.length - 1] //TODO fail on fcn
	},
	set: null,
	map: function map() {
		var path = this.path.slice();
		for (var i=0; i<arguments.length; ++i) path.push(arguments[i]);
		return new Lens(this.set, path)
	},
	get: function get(obj) {
		var val = obj,
				path = this.path;
		for (var i=0; i<path.length; ++i) {
			var key = path[i];
			if (val[key] !== undefined) val = val[key];       // key
			else if (typeof key === 'function') val = key(val); // map //TODO step(val, key)
			else return
		}
		return val
	},
	ap: function ap(lens) {
		return new Lens(this.set, this.path.concat(lens.path))
	}
};

function addPatch(patch, node) {
	var extra = extras.get(node);
	if (!extra) extra = new Extra(node);

	if (!extra.patch) extra.patch = [patch];
	else extra.patch.push(patch);
	return node
}

function setProperty(key, val, node) {
	// curried function if node missing
	if (!node) return function(n) { return setProperty(key, val, n) }

	// dynamic patch is value is a lens
	if (val instanceof Lens) return addPatch(function(n, v,k,o) {
		return setProperty(key, val.get(v,k,o), n)
	}, node)

	// normal
	if (node[key] !== val) node[key] = val;
	return node
}

function setText(txt, node) {
	// curried function if node missing
	if (!node) return function(n) { return setText(txt, n) }

	// dynamic patch is value is a lens
	if (txt instanceof Lens) return addPatch(function(n, v,k,o) {
		return setText(txt.get(v,k,o), n)
	}, node)

	// normal
	var child = node.firstChild;
	if (child && !child.nextSibling) {
		if (child.nodeValue !== txt) child.nodeValue = txt;
	}
	else node.textContent = txt;
	return node
}

function setAttribute(key, val, node) {
	// curried function if node missing
	if (!node) return function(n) { return setAttribute(key, val, n) }

	// dynamic patch is value is a lens
	if (val instanceof Lens) return addPatch(function(n, v,k,o) {
		return setAttribute(key, val.get(v,k,o), n)
	}, node)

	// normal
	if (val === false) node.removeAttribute(key);
	else node.setAttribute(key, val === true ? '' : val);
	return node
}

function addChild(child, parent) {
	if (child instanceof Lens) throw Error('childLens not supported')
	if (!parent) return function(n) { return addChild(child, n) }
	switch(child == null ? child : child.constructor || Object) { //eslint-disable-line eqeqeq
		case null: case undefined:
			return parent
		case Array:
			for (var i=0; i<child.length; ++i) addChild(child[i], parent);
			return parent
		case Number:
			parent.appendChild(createTextNode(''+child));
			return parent
		case String:
			parent.appendChild(createTextNode(child));
			return parent
		default:
			var extra = extras.get(child);
			if (extra) extra.moveTo(child, parent);
			else if (child.nodeType) parent.appendChild(child);
			else throw Error ('unsupported child type ' + typeof child)
			return parent
	}
}

var svgURI = 'http://www.w3.org/2000/svg';

/**
* @function comment
* @param  {string} string commentNode data
* @return {!Object} commentNode
*/
function createComment(string) {
	return defaultView.document.createComment(string)
}

/**
* @function fragment
* @return {!Object} documentFragment
*/
function createDocumentFragment() {
	return defaultView.document.createDocumentFragment()
}

/**
* @function text
* @param  {string|Lens} text textNode data
* @return {!Object} textNode
*/
function createTextNode(text) {
	var doc = defaultView.document;
	if (text instanceof Lens) {
		return setText(text, doc.createTextNode('')) // integrate logic here???
	}
	return doc.createTextNode(text)
}

function createElement(tag) {
	var node = tag.nodeType ? tag : defaultView.document.createElement(tag);
	for (var i=1; i<arguments.length; ++i) decorate(node, arguments[i]);
	return node
}

function createElementNS(nsURI, tag) {
	var node = tag.nodeType ? tag : defaultView.document.createElementNS(nsURI, tag);
	for (var i=2; i<arguments.length; ++i) decorate(node, arguments[i]);
	return node
}

function createElementSVG(tag) {
	var node = tag.nodeType ? tag : defaultView.document.createElementNS(svgURI, tag);
	for (var i=1; i<arguments.length; ++i) decorate(node, arguments[i]);
	return node
}

function decorate(node, stuff) {
	if (typeof stuff === 'function') stuff(node);
	else addChild(stuff, node);
}

function setChildren(parent, childIterator, after, before) {
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

function insertNewChild(newChild) { //TODO nexted lists
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

function updateNode(node, v,k,o) {
	var extra = extras.get(node),
			last = extra && extra.update ? extra.update(node, v,k,o) : node;

	var ptr = node.firstChild;
	while (ptr) ptr = updateNode(ptr, v,k,o).nextSibling;
	return last
}

/**
* @function createList
* @param  {List|Node|Function} model list or component factory or instance to be cloned
* @param  {Function|string|number} [dataKey] record identifier
* @return {!List} new List
*/
function createList(model, dataKey) {
	return new List(
		typeof model === 'function' ? model : function() { return cloneNode(model, true) },
		dataKey
	).foot
}

/**
 * @constructor
 * @param {Function} factory - component generating function
 * @param {*} dKey - data key
 */
function List(factory, dKey) {
	if (dKey !== undefined) {
		this.dataKey = typeof dKey === 'function' ? dKey : function(v) { return v[dKey] };
	}
	this.data = []; //???
	// lookup maps to locate existing component and delete extra ones
	this.mapKN = {}; // dataKey => component, for updating
	this.factory = factory;

	//required to keep parent ref when no children.length === 0
	this.head = createComment('^');
	this.foot = createComment('$');
	extras.set(this.head, this);
	extras.set(this.foot, this);
}
List.prototype = {
	constructor: List,
	dataKey: function dataKey(v,i) { return i },

	forEach: function forEach(fcn, ctx) {
		var data = this.data; //TODO???
		for (var i=0; i<data.length; ++i) {
			var key = this.dataKey(data[i], i, data);
			fcn.call(ctx, this.mapKN[key], key);
		}
	},

	/**
	* @function clone
	* @return {!List} new List
	*/
	clone: function clone() {
		return new List(this.factory, this.dataKey).foot
	},

	/**
	* @function moveTo
	* @param  {Object} edge unused head or foot node
	* @param  {Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!List} this
	*/
	moveTo: function moveTo(edge, parent, before) {
		var foot = this.foot,
				head = this.head,
				origin = head.parentNode,
				cursor = before || null;
		// skip case where there is nothing to do
		if ((origin || parent) && cursor !== foot && (origin !== parent || cursor !== foot.nextSibling)) {
			// newParent == null -> remove only -> clear list and dismount head and foot
			if (!parent) {
				setChildren(origin, null, head, foot);
				origin.removeChild(head);
				origin.removeChild(foot);
			}
			// relocate
			else {
				parent.insertBefore(head, cursor);
				parent.insertBefore(foot, cursor);
				setChildren(parent, this, head, foot);
			}
		}
		return foot
	},

	update: function update(edge, arr) {
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
			var node = newKN[key] = oldKN[key] || this.factory(key, i);
			updateNode(node, val, i, arr);
		}

		// update the view
		var parent = this.foot.parentNode;
		if (parent) setChildren(parent, this, this.head, this.foot);
		return this.foot
	}
};

// DOM

exports.setDefaultView = setDefaultView;
exports.cloneNode = cloneNode;
exports.createElement = createElement;
exports.createElementNS = createElementNS;
exports.createElementSVG = createElementSVG;
exports.createComment = createComment;
exports.createTextNode = createTextNode;
exports.createDocumentFragment = createDocumentFragment;
exports.setAttribute = setAttribute;
exports.setText = setText;
exports.setProperty = setProperty;
exports.addChild = addChild;
exports.setChildren = setChildren;
exports.updateNode = updateNode;
exports.createLens = createLens;
exports.createList = createList;
exports.extras = extras;

}((this.picoDOM = this.picoDOM || {})));
