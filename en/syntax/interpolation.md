# interpolation

interpolation is a most common part of template.

```html
<p class="m-modal m-modal-{klass}" on-click={this.remove(user)}>
  {user.name}
</p>

```

you can find interpolation at either textNode or attributeNode.


## Text interpolation

when used as text-interpolation, regular will create a TextNode and set the value as the node's textContent.

__Example__

```js
// you can just use Regular to create non-reusable component
var app = new Regular({
  template: "<div>{username}</div>",
  data: {username: 'leeluolee'}
});

app.$inject('#app');


```

will output `<div>leeluolee</div>`. Whenerver the data changes, the textNode's content is also updated. it is a __one-way__ binding.


## Attribute interpolation


When used as attribute-interpolation(only the value can be interpolated):

1. if the value is a string but contains interpolation(e.g. `class='m-modal m-modal-{klass}'`), the string will be considered as a interpolation.

2. if the attribute is not a [directive](../core/directive.md), once the value changes, the attribute's value will be updated immediately. it is a __one-way binding__.

3. if the attribute is a directive, regularjs will call the directive's link method but do nothing else.



__Example__

```javascript

<input
  type='radio'
  class={klass}
  r-model={checked}
  style="left: {10 + offsetX}px; top: {10 + offsetY}px"
  > 

```

like the example above.

1. `r-model`: directive
2. `style`: string-interpolation
3. `class`: simple attribute interpolation
4. `type`: just normal attribute




