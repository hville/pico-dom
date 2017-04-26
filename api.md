## Classes

<dl>
<dt><a href="#Extra">Extra</a></dt>
<dd></dd>
<dt><a href="#List">List</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#text">text(text)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#createList">createList(model, [dataKey])</a> ⇒ <code><a href="#List">List</a></code></dt>
<dd></dd>
<dt><a href="#clone">clone()</a> ⇒ <code><a href="#List">List</a></code></dt>
<dd></dd>
<dt><a href="#moveTo">moveTo(parent, [before])</a> ⇒ <code><a href="#List">List</a></code></dt>
<dd></dd>
</dl>

<a name="Extra"></a>

## Extra
**Kind**: global class  
<a name="new_Extra_new"></a>

### new exports.Extra(node, [extra], [key], [idx])
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

### new exports.List(factory, dKey)
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

<a name="text"></a>

## text(text) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - textNode  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>text</td><td><code>string</code> | <code>Getter</code></td><td><p>textNode data</p>
</td>
    </tr>  </tbody>
</table>

<a name="createList"></a>

## createList(model, [dataKey]) ⇒ <code>[List](#List)</code>
**Kind**: global function  
**Returns**: <code>[List](#List)</code> - new List  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>model</td><td><code><a href="#List">List</a></code> | <code>Node</code> | <code>function</code></td><td><p>list or component factory or instance to be cloned</p>
</td>
    </tr><tr>
    <td>[dataKey]</td><td><code>function</code> | <code>string</code> | <code>number</code></td><td><p>record identifier</p>
</td>
    </tr>  </tbody>
</table>

<a name="clone"></a>

## clone() ⇒ <code>[List](#List)</code>
**Kind**: global function  
**Returns**: <code>[List](#List)</code> - new List  
<a name="moveTo"></a>

## moveTo(parent, [before]) ⇒ <code>[List](#List)</code>
**Kind**: global function  
**Returns**: <code>[List](#List)</code> - this  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>parent</td><td><code>Object</code></td><td><p>destination parent</p>
</td>
    </tr><tr>
    <td>[before]</td><td><code>Object</code></td><td><p>nextSibling</p>
</td>
    </tr>  </tbody>
</table>

