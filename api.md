## Functions

<dl>
<dt><a href="#preset">preset(defaults)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#list">list(model, [dataKey])</a> ⇒ <code>List</code></dt>
<dd></dd>
<dt><a href="#list">list(model, [dataKey])</a> ⇒ <code>List</code></dt>
<dd></dd>
<dt><a href="#comment">comment(string)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#text">text(string)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#fragment">fragment()</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#decorate">decorate(element, config, [children])</a> ⇒ <code>Object</code></dt>
<dd><p>Parse a CSS-style selector string and return a new Element</p>
</dd>
<dt><a href="#getExtra">getExtra(item, [Extra])</a> ⇒ <code>Object</code></dt>
<dd></dd>
</dl>

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

<a name="list"></a>

## list(model, [dataKey]) ⇒ <code>List</code>
**Kind**: global function  
**Returns**: <code>List</code> - new List  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>model</td><td><code>List</code> | <code>Component</code> | <code>function</code></td><td><p>list or component factory or instance to be cloned</p>
</td>
    </tr><tr>
    <td>[dataKey]</td><td><code>function</code> | <code>string</code> | <code>number</code></td><td><p>record identifier</p>
</td>
    </tr>  </tbody>
</table>

<a name="list"></a>

## list(model, [dataKey]) ⇒ <code>List</code>
**Kind**: global function  
**Returns**: <code>List</code> - new List  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>model</td><td><code>List</code> | <code>Node</code> | <code>function</code></td><td><p>list or component factory or instance to be cloned</p>
</td>
    </tr><tr>
    <td>[dataKey]</td><td><code>function</code> | <code>string</code> | <code>number</code></td><td><p>record identifier</p>
</td>
    </tr>  </tbody>
</table>

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
<a name="decorate"></a>

## decorate(element, config, [children]) ⇒ <code>Object</code>
Parse a CSS-style selector string and return a new Element

**Kind**: global function  
**Returns**: <code>Object</code> - - The parsed element definition [sel,att]  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>element</td><td><code>Object</code></td><td><p>element to be decorated</p>
</td>
    </tr><tr>
    <td>config</td><td><code>Object</code></td><td><p>The existing definition to be augmented</p>
</td>
    </tr><tr>
    <td>[children]</td><td><code>Array</code></td><td><p>Element children Nodes,Factory,Text</p>
</td>
    </tr>  </tbody>
</table>

<a name="getExtra"></a>

## getExtra(item, [Extra]) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - the extra node context  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>item</td><td><code>Object</code></td><td><p>node or extra</p>
</td>
    </tr><tr>
    <td>[Extra]</td><td><code>function</code></td><td><p>creates an instance if not existign</p>
</td>
    </tr>  </tbody>
</table>

