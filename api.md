## Classes

<dl>
<dt><a href="#Component">Component</a></dt>
<dd></dd>
<dt><a href="#List">List</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#moveto">moveto(parent, [before])</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#clear">clear([after])</a> ⇒ <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Component"></a>

## Component
**Kind**: global class  
<a name="new_Component_new"></a>

### new Component(node, [extra], [key], [idx])
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>node</td><td><code>Object</code></td><td><p>DOM node</p>
</td>
    </tr><tr>
    <td>[extra]</td><td><code>Object</code></td><td><p>configuration</p>
</td>
    </tr><tr>
    <td>[key]</td><td><code>*</code></td><td><p>optional data key</p>
</td>
    </tr><tr>
    <td>[idx]</td><td><code>number</code></td><td><p>optional position index</p>
</td>
    </tr>  </tbody>
</table>

<a name="List"></a>

## List
**Kind**: global class  
<a name="new_List_new"></a>

### new List(factory, dKey)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>factory</td><td><code>function</code></td><td><p>component generating function</p>
</td>
    </tr><tr>
    <td>dKey</td><td><code>*</code></td><td><p>data key</p>
</td>
    </tr>  </tbody>
</table>

<a name="moveto"></a>

## moveto(parent, [before]) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - header  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>parent</td><td><code>Object</code></td><td><p>parentNode</p>
</td>
    </tr><tr>
    <td>[before]</td><td><code>Object</code></td><td><p>nextSibling</p>
</td>
    </tr>  </tbody>
</table>

<a name="clear"></a>

## clear([after]) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - list instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[after]</td><td><code>Object</code></td><td><p>optional Element pointer</p>
</td>
    </tr>  </tbody>
</table>

