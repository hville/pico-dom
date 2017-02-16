/*
TAKEWAY
- REMOVALS any parent can take an element away, only owner can remove
	- removed with parent !== null OK
	- removed with parent === null ERROR
	- moved (same parent) - see ADDITIONS
- REMOVALS of header/footer
	- parent === null, removeAll
	- parent !== null, oldParent === newParent, moveAll
- ADDITION of header/footer
	- oldParent === null, !!!need to fake this and move to observed document fragment
	- parent !== null OR oldParent === newParent, moveAll
- ADDITIONS only oner can add add nodes to self
	- added within markers ERROR (greatly simplifies nested items)
	- else ignore
- Properties/Methods
	* firstChild === header.nextSibling
	* lastChild === footer.previousSibling
	* childNodes ==> iterate and keep ==> NodeList .items, .length .forEach
	* children ==> childNodeFilter ==> NodeList .items, .length .forEach
	* appendChild ==> insertBefore footer
	* insertBefore ==> insertBefore
	* removeChild ==> removeChild
	* nextSibling === footer.nextSibling
	* previousSibling === header.previousSibling
	* ??? fragment.contains( otherNode ) => true for all within
	* ??? fragment.hasChildNodes() => true if header.nextSibling !== footer
	* ??? head.compareDocumentPosition(foot) & Node.DOCUMENT_POSITION_FOLLOWING) === 1
- Other Behavoiur
	* move header|footer, move all

- Implementation
	* header and footer hidden shared sharedContext
	* Mutation observer: doShit, takeRecords
	* when created (parent===null), imbed in selfDocumentFragment for MutationObserver
	* ? observe Header data attribute, imbed length and isMounted <!-- -3 -->
*/



// NAME: DocumentFragment, Fragment, NodeList,
var observerConfig = {
	childList: true
}
function observerCB(records, observer) {
	records.forEach(function (rec) {
		var parent = rec.target//NodeList
		rec.addedNodes//NodeList
		rec.removedNodes //NodeList
	})
	// moved if rec.target === parent && head||foot
	observer.takeRecords() //clear past events
}

//https://github.com/trueadm/fragment-node/blob/master/src/index.js
function following(a, b) {
	return a.compareDocumentPosition(b) & 4
}
var sharedProperties = {
	remove: {
		value: function remove() {
			var ctx = this.sharedContext,
					head = ctx.head,
					foot = ctx.foot,
					frag = ctx.fragment
			while(head.nextSibling !== foot) frag.appendChild(head.nextSibling)
			frag.insertBefore(head, frag.firstChild)
			frag.appendChild(foot)
			return frag
		}
	},
	removeChild: {
		value: function removeChild(child) {
			return this.parentNode.removeChild(child)
		}
	},
	appendChild: {
		value: function appendChild(el) {
			var ctx = this.sharedContext.foot
			foot.parentNode.insertBefore(el, foot)
		}
	},
	insertBefore: {
		value: function insertBefore(el, ref) {
			var ctx = this.sharedContext,
					foot = ctx.foot,
					head = ctx.head
			if (following(head, ref) && following(ref, foot)) {
				return foot.parentNode.insertBefore(el, ref)
			}
			throw Error('reference node is not in fragment')
		}
	},
	previousSibling: {
		get: function previousSibling() {
			return this.sharedContext.head.previousSibling
		}
	},
	firstChild: {
		get: function firstChild() {
			return this.sharedContext.head.nextSibling
		}
	},
	nextSibling: {
		get: function nextSibling() {
			return this.sharedContext.foot.nextSibling
		}
	},
	lastChild: {
		get: function lastChild() {
			return this.sharedContext.foot.previousSibling
		}
	},
}
function createPointer(ctx) {
	var ptr = Object.defineProperties(document.createComment(''), sharedProperties)
	ptr.sharedContext = ctx
	return ptr
}
var observerProps = {
	childList: true
}
function Fragment() {
	this.head = createPointer(this)
	this.foot = createPointer(this)
	this.childNodes = []
	this.fragment = document.createDocumentFragment()
	var observer = new MutationObserver(observerCB)
	observer.observe(parent, observerProps)
}
