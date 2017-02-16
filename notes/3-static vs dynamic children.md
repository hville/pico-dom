# static vs dynamic groups

Takeaway: dynamic children with `.moveChild` and `.mount`

## static

* no children change
* must create a new component or a new Children
* *only accept factories as children, no components* (else in 2 places)
* messy

## dynamic

```javascript
children.moveChild(sel, otherChildren, beforeSel)
```

* triggers `setChildren` on both Children
