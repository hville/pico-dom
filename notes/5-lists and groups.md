# lists and groups

Takeaway: headerComment for Positionning

## Positionning - External

* `setChildren(parent, xyz, before)`
  * Array -> before = xyz.reduce((before, itm)=>return before=...)
  * Element -> before = parent.el.insertBefore(xyz, before)
  * Component -> before = parent.el.insertBefore(xyz.el, before)
  * Group -> xyz.content.each(parent.el.insertBefore(xyz.el, before)

## Positionning - Update

* `.parent` `.before`
  * if before === null, move last (appendChild)
* `.parent` `.after`
  * if after === null, move first (before firstChild)
* `.headerComment`, every group has a closing comment Node
  * insertbefore(head.parent, el[i], head.nextSibling)
* `.footerComment`
  * all items moved on every setChildren


## Positionning - Utils

* Node.contains(otherNode) => true|false
* Node.hasChildNodes() => true|false
* Node.compareDocumentPosition(otherNode) => disconnected, preceding, following, contains, containedby
* Document.createComment(data) => not visible but in sourceview
* Document.createDocumentFragment() => does not keep any position info
