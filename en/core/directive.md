# Directive

Directive is similar to angular's directive, but it is more lightweight( in other words, less powerful __`:)`__ ). you can consider it as enhancement of the node.

## API

__`Component.directive(<String|RegExp> name, <Object|Function> spec)`__

  - name : directive's name, also accept RegExp to match multiple attributeName.
  - Function spec(elem, value) :
    - elem:  the target element
    - value: the attributeValue. maybe `String`(r-test ="haha" ) or`Expression` (r-test={haha})
    - this:  point to component self


__Example__



```javascript
Regular.directive('r-html', function(elem, value){
  this.$watch(value, function(newValue){
    elem.innerHTML = newValue
  })
})
```
The directive`r-html` create a unescaped interpolation with innerHTML.

Beacuse [`$watch`](../core/binding.md) accepts [String] and [Expression] as the first param, you can use `r-html` in two ways:



```html
  <div class='preview' r-html='content'></div>
  <!-- or -->
  <div class='preview' r-html={content}></div>
```

In fact, all regularjs's builtin directive accepts [String] and [Expression]. but you can have different logic betweenn them when defining your own directive.

If the directive need some teardown work, you can return a destroy function(e.g. dom related operation) . __but you dont need to `$unwatch` the watcher defined in directive , regularjs record it for you and unwatch it automatically__


__Example__

```javascript

Regular.directive('some-directive', function(elem, value){

  return function destroy(){
    ... destroy logic
  }
})

```




<a name="builtin"></a>
## Builtin Directive

regularjs provides some basic directives for you.

### 1. `r-model`

very similar to `ng-model` in angular, `r-model` can help you to create two-way binding between data and the form element.

you can check the [r-model-example](http://jsfiddle.net/leeluolee/4y25j/) on jsfiddle.

* `input、textarea`:
  simple text binding
  ```
  <textarea  r-model='textarea'>hahah</textarea>
  <input  r-model='input' />
  ```


* `input:checkbox`:
  binding the input's checked state to a boolean type field

  ```
  <input type="checkbox" checked  r-model={checked}> Check me out (value: {checked})
  // checked = true
  ```


* `input:radio`:
  binding to input.value

  ```html
  <input type="radio"value="option1" r-model={radio}>
  ```


* `select`:
  binding to select.value

  ```html
  <!-- city = 1 -->
  <select r-model={city}>
    <option value="1" selected>Hangzhou</option>
    <option value="2">Ningbo</option>
    <option value="3">Guangzhou</option>
  </select>

  ```




### 2. `r-style`

`r-style` is an enhancement for plain `style` interpolation.


__Exmaple__

```javascript
var app = new Regular({
    template:
      "<button class='btn' on-click={left=left+10} r-style={ {left: left+'px'} } >left+10</button>\
      left:  {left}",
    data: {left:1}
}).$inject(document.body)

```

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/aaWQ7/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Description

|Param|Type|Details|
|---|---|---|
|r-style | `expression` | `Expression` will eval to an object whose keys are CSS style names and values are corresponding values for those CSS keys.|




> __Warning: if there is already an interpolation on `style`, the `r-style` will be overridden__

> for examle . `<div style='left: {left}px' r-style='{left: left+"px"}'></div>`

### 3. `r-class`

simmilar to `r-style`. `r-class` is an enhancement for plain `class` interpolation,


__Example__

```html
<div r-class='{"active": page === "home"}'></div>
```

in this example, when `page === 'home'` , the `active` will attach to the node`div` , or vice versa.

Description

|Param|Type|Details|
|---|---|---|
|r-class | `expression` | `Expression` eval to `Object`: a map of class names to boolean values. In the case of a map, the names of the properties whose values are true will be added as css classes to the element.|





> __Warning: just like `r-style`, if there is already an interpolation on `class`, the `r-class` will be overridden__

### 4. `r-hide`

__Exmaple__

```html
<div r-hide="page !== 'home'"></div>
```

if the Expression `page !== 'home'` is evaluated to true, the `display:none` will attach to the `div`.




### 5. `r-html`

unescaped interpolation use innerHTML. beware of attack like `xss`.

__Example__

```javascript
<div class='preview' r-html={content}></div>
```





