/* hugov@runbox.com | https://github.com/hville/pico-dom.git | license:MIT */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var DOC = typeof document !== 'undefined' ? document : void 0;

function setDocument(doc) {
	DOC = doc;
}

// ᵖᵢᶜₒ
var extras = {
	get: function(node) { return node._pico },
	set: function(node, val) { return node._pico = val },
	node: function(obj) { return obj.node || obj.nodeType && obj || null }
};

//TODO delete?

function cloneNode(node, deep) { //TODO change instanceof to List properties
	// components have their own logic
	var extra = node.update ? node : extras.get(node); //TODO isCo
	if (extra) {
		return extra.foot ? extra.clone(deep).foot : extra.clone(deep).node
	}

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

		if (extra) extra.moveTo(copy);
		else copy.appendChild(childCopy);

		childNode = nextNode;
	}
	return copy
}

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

function assign(target, source) {
	for (var i=0, ks=Object.keys(source); i<ks.length; ++i) target[ks[i]] = source[ks[i]];
	return target
}

function updateChildren(parent, v,k,o, after, before) {
	var cursor = after ? after.nextSibling : parent.firstChild;
	while (cursor != before) { //eslint-disable-line eqeqeq
		var extra = extras.get(cursor);
		if (extra) {
			extra.update(v,k,o);
			if (extra.foot) cursor = extra.foot;
		}
		cursor = cursor.nextSibling;
	}
	return parent
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
	var target = extras.node(parent);
	if (!after) return target.insertBefore(child, parent.firstChild) //TODO getNode
	var before = after.nextSibling;
	return !before ? parent.appendChild(child)
	: child === before ? child
	// likely deletion, possible reshuffle
	: child === before.nextSibling ? parent.removeChild(before)
	// insert child before oldChild
	: target.insertBefore(child, before) //TODO getNode
}

/**
* @function createList
* @param  {List|Node|Function} model list or component factory or instance to be cloned
* @param  {Function|string|number} [dataKey] record identifier
* @return {!List} new List
*/
function createList(model, dataKey) {
	var factory = typeof model === 'function' ? model
			: model.clone ? function() { return model.clone(true) }
			: function() { return new Extra(model.cloneNode(true)) };
	return new List(factory, dataKey) //dataKeyMethod??
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
	this.mapKC = {}; // dataKey => component, for updating
	this.factory = factory;

	//required to keep parent ref when no children.length === 0
	this.head = DOC.createComment('^');
	this.foot = DOC.createComment('$');
	extras.set(this.head, this);
	extras.set(this.foot, this);
}

var pList = List.prototype;
Object.defineProperty(pList, 'nodes', {
	get: function() { return Object.keys(this.mapKC).map(this.get, this) }
});
pList.get = function(k) { return this.mapKC[k].node };

pList.dataKey = function(v,i) { return i };

/**
* @function clone
* @return {!List} new List
*/
pList.clone = function() {
	return new List(this.factory, this.dataKey)
};

/**
* @function moveTo
* @param  {Object} parent destination parent
* @param  {Object} [before] nextSibling
* @return {!List} this
*/
pList.moveTo = function(parent, before) { //TODO sanitize parent?
	var foot = this.foot,
			head = this.head,
			origin = head.parentNode,
			target = extras.node(parent),
			cursor = before || null;
	// skip case where there is nothing to do
	if ((origin || target) && cursor !== foot && (origin !== target || cursor !== foot.nextSibling)) {
		// newParent == null -> remove only -> clear list and dismount head and foot
		if (!target) {
			setChildren(origin, null, head, foot);
			origin.removeChild(head);
			origin.removeChild(foot);
		}
		// relocate
		else {
			target.insertBefore(head, cursor);
			target.insertBefore(foot, cursor);
			setChildren(target, this.nodes, head, foot);
		}
	}
	return this
};

pList.update = pList.updateSelf = function(arr) {
	var oldKC = this.mapKC,
			newKC = this.mapKC = {},
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
		var extra = newKC[key] = oldKC[key] || this.factory(key, i);
		extra.update(val, i, arr);
		if (parent) after = placeChild(parent, extra.node, after);
	}

	// update the view
	if (parent) setChildren(parent, null, after, foot);
	return this
};

/**
 * @constructor
 * @param {Object} node - DOM node
 * @param {Object} [extra] - configuration
 * @param {*} [key] - optional data key
 * @param {number} [idx] - optional position index
 */
function Extra(node, extra) {
	if (extra) assign(this, extra);
	this.node = node;
	extras.set(node, this);
	//TODO init
}

Extra.prototype = {
	constructor: Extra,
	patch: null,
	init: null, //TODO
/*	get nextSibling() { //TODO delete
		return this.node.nextSibling
	},*/
	clone: function(deep) {
		var copy = this.node.cloneNode(false);
		// copy tree before creating initiating the new Extra
		if (deep !== false) cloneChildren(this.node, copy);
		return new Extra(copy, this)
	},
	updateChildren: function(v,k,o) {
		updateChildren(this.node, v,k,o);
		return this
	},
	update: updateSelf,
	updateSelf: updateSelf,
	moveTo: function(parent, before) {
		var node = this.node,
				oldParent = node.parentNode;
		if (parent) extras.node(parent).insertBefore(node, before || null); //TODO getNode
		else if (oldParent) oldParent.removeChild(node);
		if (this.onmove) this.onmove(oldParent, parent);
		return this
	},
	addPatch: function(patch) {
		var extra = this;
		if (!extra.patch) extra.patch = [patch];
		else extra.patch.push(patch);
		return this
	},
	setProp: function(key, val) {
		// dynamic patch if value is a getter
		if (val instanceof Getter) return this.addPatch(function(v,k,o) {
			return this.setProp(key, val.get(v,k,o))
		})

		if (this.node[key] !== val) this.node[key] = val;
		return this
	},
	setText: function(txt) {
		// dynamic patch if value is a getter
		if (txt instanceof Getter) return this.addPatch(function(v,k,o) {
			return this.setText(txt.get(v,k,o))
		})

		var child = this.node.firstChild;
		if (child && !child.nextSibling) {
			if (child.nodeValue !== txt) child.nodeValue = txt;
		}
		else this.node.textContent = txt;
		return this
	},
	setAttr: function(key, val) {
		// dynamic patch if value is a getter
		if (val instanceof Getter) return this.addPatch(function(v,k,o) {
			return this.setAttr(key, val.get(v,k,o))
		})

		if (val === false) this.node.removeAttribute(key);
		else this.node.setAttribute(key, val === true ? '' : val);
		return this
	},
	addChild: function(child) {
		/*	if (child instanceof Getter) {

		//TODO
		A: fragment with nodes getter/setter: nodes = [newNodes] || fragment.replace()
		B: list with factory (k?v,i) ?

				return this.addPatch(function(v,k,o) {
				return this.setAttr(key, val.get(v,k,o))
			})
			}
		*/
		if (child instanceof Getter) throw Error('childLens not supported')
		switch(child == null ? child : child.constructor || Object) { //eslint-disable-line eqeqeq
			case null: case undefined:
				return this
			case Array:
				for (var i=0; i<child.length; ++i) this.addChild(child[i]);
				return this
			case Number:
				this.addChild(createTextNode(''+child));
				return this
			case String:
				this.addChild(createTextNode(child));
				return this
			case Extra: case List:
				child.moveTo(this.node);
				return this
			default:
				if (child.nodeType) this.node.appendChild(child);
				else throw Error ('unsupported child type ' + typeof child)
				return this
		}
	}
};

function updateSelf(v,k,o) {
	if (this.patch) for (var i=0; i<this.patch.length; ++i) this.patch[i].call(this, v,k,o);
	return this
}

var svgURI = 'http://www.w3.org/2000/svg';

/**
* @function text
* @param  {string|Getter} text textNode data
* @return {!Object} textNode
*/
function createTextNode(text) {
	if (text instanceof Getter) return (new Extra(DOC.createTextNode(''))).setText(text)
	return new Extra(DOC.createTextNode(text || ''))
}

function createElement(tag) { //TODO addChild
	return new Extra(tag.nodeType ? tag : DOC.createElement(tag))
}

function createElementNS(nsURI, tag) {
	return new Extra(tag.nodeType ? tag : DOC.createElementNS(nsURI, tag))
}

function createElementSVG(tag) {
	return new Extra(tag.nodeType ? tag : DOC.createElementNS(svgURI, tag))
}

function update(node, v,k,o) {
	var extra = node.update ? node : extras.get(node);
	if (extra) return extra.update(v,k,o)
	return node
}

// DOM

exports.setDocument = setDocument;
exports.cloneNode = cloneNode;
exports.createElement = createElement;
exports.createElementNS = createElementNS;
exports.createElementSVG = createElementSVG;
exports.createTextNode = createTextNode;
exports.setChildren = setChildren;
exports.update = update;
exports.getter = getter;
exports.createList = createList;
exports.extras = extras;
