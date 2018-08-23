
# 获取子节点和子组件

获取到组件内部的子组件和子节点是使用 Regular 的常见需求。

## 常见DOM操作的误区

__组件本身应该是完全数据驱动，dom操作应该交由指令处理__ 在理念上并没有错，但有时直接操作DOM会简单很多。所以经常有人在 init 中写出以下代码(此时内部节点已经产生)

__Bad Case__

```js
Regular.extend({
  template: `<div id='xxx'></div>`,
  init: function(){
    const elem = document.getElementById('xxx'); 返回null
  }
})
```

这种做法并不会凑效，因为 init 时此组件并没有插入到文档中，游离状态的组件自然无法用`document.getElementById`获取到它。

但我们可以使用 ref 来解决

## ref 属性

__ref__ 是个特殊的属性，你可以使用它来标记一个__节点或组件__.

```html

const component = new Regular({
  template: "<input ref=input> <component ref=component></component>"
  init: function(){
    this.$refs.input.value = 'hahaha'
    this.$refs.component.show() // 调用子组件的方法
  }
})

```

如上例所示，在 compile 之后(比如 init 生命周期里)，就可以使用`this.$refs` 来获取到内部子节点或子组件了。

>还是应尽可能使用数据驱动的方式来构建你的UI

### ref属性是可动态插值

ref属性与其它属性一样可以插值，这样在类似循环渲染的场景中会比较有用


<script async src="//jsfiddle.net/leeluolee/tqLew7ou/embed/js,result/"></script>



## Regular.dom.element 获取组件的子节点。

除了ref，Regular还提供了 [`dom.element(component, needAll)`](../../reference/api.md#dom) 可用于获取组件内部的节点。

```js

const dom = Regular.dom;
const component = new Regular({
  template: `<div id='first'></div><p id='last'></p>`
  init: function(){
    console.log(dom.element(this)) // => div#first  
    console.log(dom.element(this, true)) // => [div#first, p#last]
  }
})
```

__说明__

- 如果needAll为`true`，返回子节点数组。


## 何时使用`dom.element` 何时使用 `ref`?


`ref` 的优点是简单直观而且高效，除此之外还可以 __获取组件__ 。 而 `dom.element` 的优势是不需要做主动的标记，可以提供`ref`无法满足的能力，例如


```js

const Component = Regular.extend({
  template: '<div ref="container">Component</div>'
  init: function(){
    this.$refs.container // ...
  }
})

// SubComponent 继承自 Component
const SubComponent = Component.extend({
  'template': '<div>SubComponent</div>'
})

```

这就会出现问题，因为`SubComponent`覆盖的模板并没有标记 container 节点。本质其实是因为 __模板的控制权不在当前组件__ 。

这个时候就可以使用`dom.element`就可以完美解决了

```js

const Component = Regular.extend({
  template: '<div>Component</div>'
  init: function(){
    console.log(dom.element(this));
  }
})

// SubComponent 继承自 Component
const SubComponent = Component.extend({
  'template': '<div>SubComponent</div>'
})

```

