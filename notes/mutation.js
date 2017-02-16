/*
takeaway: all opps => singleCall
each ops => one record
document fragment: 1 event/ops, 5 Nodes added
 mutations.forEach(function(mutation) {
   for (var i = 0; i < mutation.addedNodes.length; i++)
     insertedNodes.push(mutation.addedNodes[i]);
 }
NodeIterator: "flattened" filtered sequential nodes
TreeWalker: filtered tree

*/
/*eslint no-console:0*/

var observer = new MutationObserver(function(recs) {
	console.log ('!MUTATION : ', recs.length)
	recs.forEach(function (rec, i) {
		//rec.addedNodes: NodeList: .length, .item(i), .
		console.log(' - ', i, rec.type, rec.addedNodes.length, rec.removedNodes.length, rec.previousSibling, rec.nextSibling)
	})
})
observer.observe(document.body, {
	childList: true
})
var comment = document.createComment('comment')
function appendStuff(node) {
	node.appendChild(document.createElement('div'))
	node.appendChild(document.createElement('p'))
	node.appendChild(comment)
	node.appendChild(document.createElement('span'))
	node.appendChild(document.createTextNode('text'))
}

var frag = document.createDocumentFragment()
appendStuff(frag)
appendStuff(document.body)
observer.takeRecords() //clear past events
document.body.appendChild(frag)
console.log('switcharoo!')
document.body.appendChild(comment)
