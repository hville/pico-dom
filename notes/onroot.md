
```javascript
var observer = new MutationObserver(callback);
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
})
(function(win) {
    'use strict';

    var listeners = [],
    doc = win.document,
    MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
    observer;

    function ready(selector, fn) {
        // Store the selector and callback to be monitored
        listeners.push({
            selector: selector,
            fn: fn
        });
        if (!observer) {
            // Watch for changes in the document
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true
            });
        }
        // Check if the element is currently in the DOM
        check();
    }

    function check() {
        // Check the DOM for elements matching a stored selector
        for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
            listener = listeners[i];
            // Query for elements matching the specified selector
            elements = doc.querySelectorAll(listener.selector);
            for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                element = elements[j];
                // Make sure the callback isn't invoked with the
                // same element more than once
                if (!element.ready) {
                    element.ready = true;
                    // Invoke the callback with the element
                    listener.fn.call(element, element);
                }
            }
        }
    }

    // Expose `ready`
    win.ready = ready;

})(this)
```





Whenever possible observe direct parents nonrecursively (subtree: false). For example, it makes sense to wait for the parent element by observing document recursively, disconnect the observer on success, attach a new nonrecursive one on this container element

The documentation is unclear, but subtree is ignored unless you also specify childList:true

We start by setting up a MutationObserver which will
call our checkNode function with any new nodes which are added to the DOM

```javascript
var observer = new MutationObserver(function(mutations){
  for (var i=0; i < mutations.length; i++){
    for (var j=0; j < mutations[i].addedNodes.length; j++){
      checkNode(mutations[i].addedNodes[j], mutations[i].removedNodes[j]);
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
})
```


For the tl;dr crowd, here’s a quick snippet of how to detect DOM changes

```javascript
// Setup a new observer to get notified of changes
var observer = new MutationObserver(mutationCallback);

// Observe a specific DOM node / subtree
observer.observe(node, config);

// Stop observing changes
observer.disconnect();

// Empty the queue of records
observer.takeRecords()
```
