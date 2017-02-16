# insertion

Takeaway: BEFORE

## before

```javascript
var ptr = parent.firstChild
content.forEach(function(itm) {
  if (itm === ptr) ptr = itm.nextSibling
  else parent.insertBefore(itm, ptr)
})
while(ptr) {
  next = ptr.nextSibling
  parent.removeChild(ptr)
  ptr = next
}
```

* if all in right order, N assignments
* new item: 1 insertion, N-1 assignments
* deleted item: N/2 insertion, N/2 assignments

## after

```javascript
var ptr = null
content.forEach(function(itm) {
  if (itm === ptr.nextSibling : parent.firstChild) ptr = itm
  else parent.insertBefore(itm, ptr ? ptr.nextSibling : parent.firstChild)
})
while(ptr ? ptr.nextSibling : parent.firstChild) {
  parent.removeChild(ptr.nextSibling)
}
```

* same, but more complicated...
* if content.length === 0, ptr=null...

