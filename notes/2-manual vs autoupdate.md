# manual vs auto update

Takeaway: Manual `.children.update` or `.updateChildren` call

## children object

```javascript
function update(a,b) {
  this.children.update(2*a,2*b)
  this.namedChild.update(3*a,3*b)
}
```

* simple transformation
* simple manual triggers
* custom component this.children = new Children(parent, ?cfg, children)
* *need reference to parent*
* *need initial sync* `.children.mount` OR ``


## updateChildrenMethod

```javascript
function update(a,b) {
  this.updateChildren(2*a,2*b)
  this.namedChild.update(3*a,3*b)
}
```

* simple transformation
* simple manual triggers
* custom components missing proto method
