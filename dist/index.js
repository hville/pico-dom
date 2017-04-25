/* hugov@runbox.com | https://github.com/hville/pico-dom.git | license:MIT */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function update(node, v,k,o) {
	var extra = extras.get(node);
	if (extra) {
		extra.update(node, v,k,o);
		return extra.foot || node
	}
	return updateChildren(node, v,k,o)
}
function updateChildren(node, v,k,o) {
	var ptr = node.firstChild;
	while (ptr) ptr = update(ptr, v,k,o).nextSibling;
	return node
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

extraP.clone = function(node, deep) {
	var copy = node.cloneNode(false);
	// copy tree before creating initiating the new Extra
	if (deep !== false) cloneChildren(node, copy);
	new Extra(copy, this);
	return copy
};

extraP.update = function(node, v,k,o) {
	this.updateSelf(node, v,k,o);
	updateChildren(node, v,k,o);
};

extraP.updateSelf = function(node, v,k,o) {
	if (this.patch) for (var i=0; i<this.patch.length; ++i) this.patch[i](node, v,k,o);
	return node
};

extraP.moveTo = function(node, parent, before) {
	var oldParent = node.parentNode;
	if (parent) parent.insertBefore(node, before || null);
	else if (oldParent) oldParent.removeChild(node);
	if (this.onmove) this.onmove(oldParent, parent);
	return this
};

function getter(key) {
	return new Getter(Array.isArray(key) ? key : key != null ? [key] : []) //eslint-disable-line eqeqeq
}

function Getter(path) {
	this.path = path || [];
}

var pGetter = Getter.prototype;

pGetter.map = function() {
	var path = this.path.slice();
	for (var i=0; i<arguments.length; ++i) path.push(arguments[i]);
	return new Getter(path)
};
pGetter.get = function(obj) {
	var val = obj,
			path = this.path;
	for (var i=0; i<path.length; ++i) {
		var key = path[i];
		if (val[key] !== undefined) val = val[key];       // key
		else if (typeof key === 'function') val = key(val); // map //TODO step(val, key)
		else return
	}
	return val
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

	// dynamic patch if value is a getter
	if (val instanceof Getter) return addPatch(function(n, v,k,o) {
		return setProperty(key, val.get(v,k,o), n)
	}, node)

	// normal
	if (node[key] !== val) node[key] = val;
	return node
}

function setText(txt, node) {
	// curried function if node missing
	if (!node) return function(n) { return setText(txt, n) }

	// dynamic patch if value is a getter
	if (txt instanceof Getter) return addPatch(function(n, v,k,o) {
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

	// dynamic patch if value is a getter
	if (val instanceof Getter) return addPatch(function(n, v,k,o) {
		return setAttribute(key, val.get(v,k,o), n)
	}, node)

	// normal
	if (val === false) node.removeAttribute(key);
	else node.setAttribute(key, val === true ? '' : val);
	return node
}

function addChild(child, parent) {
	if (child instanceof Getter) throw Error('childLens not supported')
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
* @param  {string|Getter} text textNode data
* @return {!Object} textNode
*/
function createTextNode(text) {
	var doc = defaultView.document;
	if (text instanceof Getter) {
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

function setChildren(parent, children, after, before) {
	var cursor = after || null;

	// insert new children or re-insert existing
	if (children) for (var i=0; i<children.length; ++i) {
		cursor = placeChild(parent, children[i], cursor);
	}

	// remove orphans
	cursor = cursor ? cursor.nextSibling : parent.firstChild;
	while (cursor != before) { //eslint-disable-line eqeqeq
		var next = cursor.nextSibling;
		parent.removeChild(cursor);
		cursor = next;
	}
	return parent
}

function placeChild(parent, child, after) {
	if (!after) return parent.insertBefore(child, parent.firstChild)
	var before = after.nextSibling;
	return !before ? parent.appendChild(child)
	: child === before ? child
	// likely deletion, possible reshuffle
	: child === before.nextSibling ? parent.removeChild(before)
	// insert child before oldChild
	: parent.insertBefore(child, before)
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
	// lookup maps to locate existing component and delete extra ones
	this.mapKN = {}; // dataKey => component, for updating
	this.factory = factory;

	//required to keep parent ref when no children.length === 0
	this.head = createComment('^');
	this.foot = createComment('$');
	extras.set(this.head, this);
	extras.set(this.foot, this);
}

var pList = List.prototype;

pList.dataKey = function(v,i) { return i };

/**
* @function clone
* @return {!List} new List
*/
pList.clone = function() {
	return new List(this.factory, this.dataKey).foot
};

/**
* @function moveTo
* @param  {Object} edge unused head or foot node
* @param  {Object} parent destination parent
* @param  {Object} [before] nextSibling
* @return {!List} this
*/
pList.moveTo = function(edge, parent, before) {
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
};

pList.update = pList.updateSelf = function(edge, arr) {
	var oldKN = this.mapKN,
			newKN = this.mapKN = {},
			getK = this.dataKey,
			after = this.head,
			foot = this.foot,
			parent = foot.parentNode;
	//TODO simplify index keys

	// update the node keyed map
	for (var i=0; i<arr.length; ++i) {
		var val = arr[i],
				key = getK(val, i, arr);
		// find item, create Item if it does not exits
		var node = newKN[key] = oldKN[key] || this.factory(key, i);
		update(node, val, i, arr);
		if (parent) after = placeChild(parent, node, after);
	}

	// update the view
	if (parent) setChildren(parent, null, after, foot);
	return this.foot
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
exports.update = update;
exports.getter = getter;
exports.createList = createList;
exports.extras = extras;
