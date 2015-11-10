# directive——指令

定义一个指令(angular的directive的瘦身版)，做节点的功能性增强

> regular的directive之所以可以瘦身是因为组件承担了大部分职责

## API

__`Component.directive(<String|RegExp> name, <Object|Function> spec)`__

  - name 指令名如`r-model`, __name也可以是一个正则表达式，用来匹配所有符合的属性名__
  - Function spec(elem, value) 传入参数如下<br>
    - elem 绑定的元素节点
    - value 属性值(可能是字符串或是一个[Expression](../syntax/expression.md)对象)
    - this 这里的this指向component组件本身

> 当不传入spec时，directive是一个getter方法，用于获取指令定义

__Example__

创建一个innerHTML与数据的绑定。

```javascript
Regular.directive('r-html', function(elem, value){
  this.$watch(value, function(newValue){
    elem.innerHTML = newValue
  })
})
```

这里由于[$watch](../core/binding.md)同时接受字符串或者Expression，所以我们可以在模板里传字符串或插值


```html
  <div class='preview' r-html='content'></div>
  <!-- or -->
  <div class='preview' r-html={content}></div>
```


如果必要你也可以在函数返回一个destroy函数做指令的销毁工作(比如绑定了节点事件。需要注意的是，regular中watch数据是不需要进行销毁的，regular会自动清理对应的数据绑定


```javascript

Regular.directive('some-directive', function(elem, value){

  return function destroy(){
    ... destroy logic
  }
})

```




<a name="buildin"></a>
## 内建指令

当前版本，regularjs只内置了一些常用指令

### 1. `r-model` 

r-model完成的是类似`ng-model` 的双向绑定功能，它可以绑定以下几种表单元素，具体可以查看[r-model-example](http://jsfiddle.net/leeluolee/4y25j/)

* `input、textarea`: 与节点value实现双向绑定

  ```
  <textarea  r-model='textarea'>hahah</textarea>
  <input  r-model='input' />
  ```


* `input:checkbox`: 
  注意这个绑定的是布尔值，与节点的checked属性实现双向绑定

  ```
  <input type="checkbox" checked  r-model={checked}> Check me out (value: {checked})
  // checked = true
  ```


* `input:radio`:
  与节点value实现双向绑定

  ```html
  <input type="radio" value="option1" r-model={radio}>
  ```


* `select`: 
  与select的选择项实现双向绑定(对应option的value值)

  ```html
  <!-- city = 1 -->
  <select r-model={city}>
    <option value="1" selected>Hangzhou</option>
    <option value="2">Ningbo</option>
    <option value="3">Guangzhou</option>
  </select>

  ```


### 2. `r-style`

`r-style`是为了解决`style`直接插值的逻辑能力上的不足，它建立的是与elem.style的单向数据绑定关系。每当r-style绑定的表达式数据(被解释为`Object`类型)发生更新 

__Exmaple__

```javascript
var app = new Regular({
    template: 
      "<button class='btn' on-click={left=left+10} r-style={ {left: left+'px'} }>left+10</button>\
      left:  {left}",
    data: {left:1}
}).$inject(document.body)

```

[|DEMO|](http://jsfiddle.net/leeluolee/aaWQ7/)



> style属性如果已经有插值，将会覆盖r-style的定义

### 3. `r-class`

与`r-style`类似，不过是为了解决`class`的不足，每当对象某个属性值为true时，会添加对应的属性名 作为class


__Example__

```javascript


```
[|DEMO|](http://jsfiddle.net/leeluolee/aaWQ7/)


> class属性如果已经有插值，将会覆盖r-class的定义

### 4. `r-hide`

当表达式求值为真时，添加`display:none`到本节点



> 所有内建的指令都同时接受Expression或者String类型的值。



### 5. `r-html`

未转义插值绑定，注意`xss`.

__Example__

```javascript
<div class='preview' r-html={content}></div>
```


