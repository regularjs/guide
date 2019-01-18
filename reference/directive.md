# 内置指令


Regular 提供少量常用指令解决语法能力的不足, 你也尝试[实现自己的指令](api.html#directive)


##  on-[eventName] {#event}


绑定事件。


__Example__

`on-click={expression}` 

<script async src="//jsfiddle.net/leeluolee/1o2gf4um/embed/js,result/"></script>

__Arguments__

|Param|Type|Detail|
|--|--|--|
|expression| Expression |  每当指定事件触发，该表达式会被运行|
|$event| [事件对象](../basic/event.html#event) | 请参考事件章节|


事件系统完整指南请参考 [入门:事件](../basic/event.md) 章节



##  r-model {#r-model}

`r-model` 实现与表单类DOM元素的 __双向绑定__, 所以对应的表达式应该是 [setable](./expression.md#setable) 的

__Syntax__

`r-model={Expression}`


__Example__


<script async src="//jsfiddle.net/leeluolee/4y25j/embed/html,result/"></script>

__Type__

* `input、textarea`:

  - 绑定类型: String

  ```html
  <textarea  r-model={blog.title}>hahah</textarea>
  <input  r-model={input} />
  ```


* `input:checkbox`: 
  
  - 绑定类型: Boolean

  绑定[checked]属性，注意需要是

  ```html
  <input type="checkbox" checked  r-model={checked}> Check me out (value: {checked})
  ```


* `input:radio`:
  
  - 绑定类型: String

  可以绑定多个`input:radio`元素


  ```html
  <input type="radio" value="option1" r-model={radio} >
  <input type="radio" value="option2" r-model={radio} >
  ```


* `select`:
  
  - 绑定类型: String

  绑定select的value值

  ```html
  <!-- city = 1 -->
  <select r-model={city}>
    <option value="1" selected>Hangzhou</option>
    <option value="2">Ningbo</option>
    <option value="3">Guangzhou</option>
  </select>

  ```


> 双向绑定不总是 「银弹」，复杂的数据关系，你可以考虑使用`value`属性 + 表单事件监听的方式来解决


##  r-style

`r-style={Expression}` 是 style样式绑定的增强指令


__Exmaple__

```js
new Regular({
  template: `
    <button class='btn' 
      on-click={left=left+10}
      r-style={ {left: left+'px'}}
      >left+10</button> left:  {left}`,
  data: {
    left: 1
  }
}).inject(document.body)

```

<script async src="//jsfiddle.net/leeluolee/aaWQ7/13/embed/js,result/"></script>


__Arguments__

|Param|Type|Details|
|---|---|---|
|r-style | `expression` | `Expression` 求值结果应该是一个Object, 键是样式名，值是样式值 (注意Regular并不处理默认单位，请主动添加)|




⚠️如果已经有 `style` 插值了，那`r-style`的将会被覆盖

例如 `<div style='left: {left}px' r-style='{left: left+10+"px"}'></div>`

## r-class {#r-class}

与`r-style` 类型， 不过 `r-class`作用于 `class` 属性


__Example__

```html
<div r-class={{"active": page === "home"}}></div>
```

上例中，如果`page === 'home'`,则active会被添加到`div`节点的class属性中

Description

|Param|Type|Details|
|---|---|---|
|r-class | `expression` | `Expression` 求值结果应该是一个Object, 键是class名，值是Boolean值|


⚠️与`r-style`类似，如果已经存在一个 `class` 插值了， 那`r-class`的定义会被覆盖

## r-hide {#r-hide}

控制节点的 `display` 样式

__Exmaple__

```html
<div r-hide={page !== 'home'}></div>
```

如果`page !== 'home'`为真，则`display:none`样式会被添加到`style`中


## r-html {#r-html}

即`innerHTML`插值，注意 __XSS__ 攻击风险

__Example__

```html

<textarea r-model='value'>Hello</textarea>
<h2>实时编辑</h2>
<div r-html='content' > </div>

```

<script async src="//jsfiddle.net/leeluolee/k91esf42/embed/js,result/"></script>

_本例双向绑定参考[r-model](#r-model)_

## r-animation


动画系统请参考[动画章节](../basic/animation.md)






