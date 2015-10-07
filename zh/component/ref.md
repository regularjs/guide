
# 获取子节点和子组件

其实，使用Regular的开发者(包括作者本人)经常碰到的问题是:「如何获取到内部定义的子节点?」. 虽然『组件本身应该是完全数据驱动，dom操作应该交由指令处理』在理念上并没有弱点，但在有些情况下确实是舍近求远,所以会经常有人会写出了这样的代码.

```js
Regular.extend({
  template: '<div id='xxx'></div>',
  init: function(){
    var elem = document.getElementById('xxx'); 返回null
  }
})
```

这种做法不仅不会凑效, 因为init时此组件并没有插入到文档中，自然无法用`document.getElementById`获取到它. 更重要的是, 它碰坏了组件应该是是个『闭环』的基本点.

为了避免这种错误，Regular后续就引入了[__『ref属性』__]({{api}}#ref). 

## ref 属性

ref 是个特殊的属性值, 在模板中, 你可以使用它来标记一个__节点或组件__.

在模板中

```html

var component = new Regular({
  template: "<input ref=input> <pager ref=pager></pager>"
  init: function(){
    console.log(this.$refs.input)  // input element
    console.log(this.$refs.pager)  // pager component
  }
})

```

如上例所示，只要组件内的结构生成[(compile)](component/lifecycle.md)，就可以使用this.$refs来获取标记的节点或组件.


## Regular.dom.element 获取组件的子节点. 

`ref`可以解决大部分的问题，但是它有个不足就是这些标记(ref)需要手动写.

Regular提供了封装了[dom相关方法的简单封装]({{api}}#dom), 你可以通过`Regular.dom`获得这个方法集合, 其中有个特殊的方法[`dom.element(component, needAll)`]() 可用于获取组件内部的节点.

```js
var dom = Regular.dom;
var component = new Regular({
  template: '<div id='first'></div><p id='last'></p>'
  init: function(){
    console.log(dom.element(this)) // => div#first  
    console.log(dom.element(this, true)) // => [div#first, p#last]
  }
})
```

如果needAll为`true`, 返回子节点数组. 



## 何时使用`dom.element` 何时使用 `ref`?


`ref`的优点是简单直观，并且除了节点还可以__获取组件__, 而且`ref`引用是动态的, 比如` <div ref={name}></div>`, 如果模板中节点被回收，引用也会自动去除.

而`dom.element`的优势是不需要做主动的标记, 这在有些情况, `ref`是完全做不到的, 比如:


```js
var Component = Regular.extend({
  template: '<div ref="container"></div>'
  init: function(){
    this.$refs.container // ...
  }
})

var SubComponent = Component.extend({
  'template': '<div></div>'
})

```

这就会出现问题，因为`SubComponent`覆盖的模板并没有标记container节点. 这种情况其实是因为__模板的控制权不在当前组件__. 

同样的问题还会出现在内嵌组件在组合使用时, 因为[内嵌内容](component/composite.md)是不属于当前组件控制的, 就如下例的`<li></li>`, 你无法在`Dragable`组件内部标记到它.

```html
<dragable on-dragstart='start'>
  <li>This is a dragable area</li>
</dragable>
```

> _上面的例子你可能需要理解[组件组合](component/composite.md)_


