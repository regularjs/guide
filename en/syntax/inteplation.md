# Inteplation

Inteplation is most common part of the template.

```html
<p class="m-modal m-modal-{{klass}}" on-click={{this.remove(user)}}> 
  {{user.name}} 
</p>

```

you can find inteplation at either textNode or attributeNode.


## Text Inteplation

when used as text-inteplation, regular will create a TextNode and set the value as the node's textContent.

__Example__

```js
// you can just use Regular to create non-reusable component
var app = new Regular({
  template: "<div>{{username}}</div>",
  data: {username: 'leeluolee'}
});

app.inject('#app');


```

will outport `<div>leeluolee</div>`. and whenerver the data changes, the textNode's content is also updated. it is a __one-way__ binding.


## Attribute Inteplation


When used as attribute-inteplation(only the value can be interpolated), there is some explanations.

1. if the value is a string but contains inteplation(e.g. `class='m-modal m-modal-{{klass}}'`), the string will be considered as a inteplation.

2. if the attribute is not a [directive](../core/directive.md). once the value changes, the attribute's value will update directly. it is a __one-way binding__.

3. if the attribute is a directive. regularjs will call the directive's link method but do noting else.



__Example__

```javascript

<input 
  type='radio'  
  class={{klass}}   
  r-model={{checked}}
  style="left: {{10 + offsetX}}px; top: {{10 + offsetY}}px"
  > </input>

```

like the example above.

1. `r-model`: directive
2. `style`: string-inteplation
3. `class`: simple attribute inteplation
4. `type`: just normal attribute













