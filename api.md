## Classes

<dl>
<dt><a href="#Component">Component</a></dt>
<dd></dd>
<dt><a href="#List">List</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#preset">preset(defaults)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#clone">clone([key], [idx])</a> ⇒ <code><a href="#Component">Component</a></code></dt>
<dd></dd>
<dt><a href="#moveTo">moveTo(parent, [before])</a> ⇒ <code><a href="#Component">Component</a></code></dt>
<dd></dd>
<dt><a href="#setText">setText(text)</a> ⇒ <code><a href="#Component">Component</a></code></dt>
<dd></dd>
<dt><a href="#removeChildren">removeChildren([after])</a> ⇒ <code><a href="#Component">Component</a></code></dt>
<dd></dd>
<dt><a href="#updateChildren">updateChildren(...optional)</a> ⇒ <code><a href="#Component">Component</a></code></dt>
<dd></dd>
<dt><a href="#list">list(model, [dataKey])</a> ⇒ <code><a href="#List">List</a></code></dt>
<dd></dd>
<dt><a href="#clone">clone()</a> ⇒ <code><a href="#List">List</a></code></dt>
<dd></dd>
<dt><a href="#moveTo">moveTo(parent, [before])</a> ⇒ <code><a href="#List">List</a></code></dt>
<dd></dd>
<dt><a href="#removeChildren">removeChildren([after])</a> ⇒ <code><a href="#List">List</a></code></dt>
<dd></dd>
<dt><a href="#updateChildren">updateChildren(arr, ...optional)</a> ⇒ <code><a href="#List">List</a></code></dt>
<dd></dd>
<dt><a href="#text">text(string)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#fragment">fragment()</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#comment">comment(string)</a> ⇒ <code>Object</code></dt>
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

<a name="preset"></a>

## preset(defaults) ⇒ <code>function</code>
**Kind**: global function  
**Returns**: <code>function</code> - component hyperscript function  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>defaults</td><td><code>Object</code></td><td><p>preloaded component defaults</p>
</td>
    </tr>  </tbody>
</table>

<a name="clone"></a>

## clone([key], [idx]) ⇒ <code>[Component](#Component)</code>
**Kind**: global function  
**Returns**: <code>[Component](#Component)</code> - new Component  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[key]</td><td><code>*</code></td><td><p>optional key</p>
</td>
    </tr><tr>
    <td>[idx]</td><td><code>number</code></td><td><p>optional position index</p>
</td>
    </tr>  </tbody>
</table>

<a name="moveTo"></a>

## moveTo(parent, [before]) ⇒ <code>[Component](#Component)</code>
**Kind**: global function  
**Returns**: <code>[Component](#Component)</code> - this  
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

<a name="setText"></a>

## setText(text) ⇒ <code>[Component](#Component)</code>
**Kind**: global function  
**Returns**: <code>[Component](#Component)</code> - this  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>text</td><td><code>string</code></td><td><p>textNode data</p>
</td>
    </tr>  </tbody>
</table>

<a name="removeChildren"></a>

## removeChildren([after]) ⇒ <code>[Component](#Component)</code>
**Kind**: global function  
**Returns**: <code>[Component](#Component)</code> - this  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[after]</td><td><code>Object</code></td><td><p>optional last node to be kept</p>
</td>
    </tr>  </tbody>
</table>

<a name="updateChildren"></a>

## updateChildren(...optional) ⇒ <code>[Component](#Component)</code>
**Kind**: global function  
**Returns**: <code>[Component](#Component)</code> - list instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>...optional</td><td><code>*</code></td><td><p>arguments</p>
</td>
    </tr>  </tbody>
</table>

<a name="list"></a>

## list(model, [dataKey]) ⇒ <code>[List](#List)</code>
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
    <td>model</td><td><code><a href="#List">List</a></code> | <code><a href="#Component">Component</a></code> | <code>function</code></td><td><p>list or component factory or instance to be cloned</p>
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
    <td>parent</td><td><code>Object</code></td><td><p>parentNode</p>
</td>
    </tr><tr>
    <td>[before]</td><td><code>Object</code></td><td><p>nextSibling</p>
</td>
    </tr>  </tbody>
</table>

<a name="removeChildren"></a>

## removeChildren([after]) ⇒ <code>[List](#List)</code>
**Kind**: global function  
**Returns**: <code>[List](#List)</code> - list instance  
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

<a name="updateChildren"></a>

## updateChildren(arr, ...optional) ⇒ <code>[List](#List)</code>
**Kind**: global function  
**Returns**: <code>[List](#List)</code> - list instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>arr</td><td><code>Array</code></td><td><p>array of values to update</p>
</td>
    </tr><tr>
    <td>...optional</td><td><code>*</code></td><td><p>update arguments</p>
</td>
    </tr>  </tbody>
</table>

<a name="text"></a>

## text(string) ⇒ <code>Object</code>
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
    <td>string</td><td><code>string</code></td><td><p>textNode data</p>
</td>
    </tr>  </tbody>
</table>

<a name="fragment"></a>

## fragment() ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - documentFragment  
<a name="comment"></a>

## comment(string) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - commentNode  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>string</td><td><code>string</code></td><td><p>commentNode data</p>
</td>
    </tr>  </tbody>
</table>

