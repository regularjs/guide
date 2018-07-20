# 组件化


大部分的人脑中对 __组件化__ 的理解似乎开始停留在了__【标签化】__这个层级上，事实上组件的定义从来不曾改变过：

> 在用户端开发领域，组件应该是一种独立的、可复用的交互元素的封装

一个Regularjs的组件满足以下等式

> 组件 = 模板 + 数据 + 业务逻辑

## 定义组件

定义一个组件通过[Component.extend]({{api}}#api-reference-静态接口-componentextend)。

```js
var Component = Regular.extend( options );
var SubComponent = Component.extend( options );

var sub = new SubComponent;
var component = new Component;

console.log(sub instanceof Regular) // true
console.log(sub instanceof Component) // true
console.log(sub instanceof SubComponent) // true

```

查看[接口文档:options]({{api}}#api-reference-静态接口-options)了解Options的细节。


#### 使用Component.implement(mixin)避免深层的继承

继承是一个很好的组件复用方式，但是深层的继承在大部分情况下是不可取的，利用mixin抽象出一些与具体组件无关的逻辑，我们可以发现有些重构是可以避免。

例如，我们在业务中引入了[Redux](https://github.com/rackt/redux)这样的流程，自然的我们需要提取一个ReduxMixin用来处理组件与Redux的数据对应。

```js
var ReduxMixin = {
  mapStateToData: function(state){
    var data = this.data;
    data.dimension = state.dimension;
  } 
}
```

但问题在于『ReduxMixin』在业务中的引入要晚于之前存在组件(甚至还会有第三方组件。重构+理清继承关系是一个可选的措施，但是有一个更好的方式就是使用`Component.implement`。

```js
Component.implement(ReduxMixin);
```

#### 调用父类同名函数

通过[Component.extend]({{api}}#api-reference-静态接口-componentextend)和[Component.implement](http://regularjs.github.io/reference/?api-zh#api-reference-静态接口-componentimplement) 扩展的方法内部可以通过__`this.supr`__调用父类同名函数。

```js

var Component = Regular.extend({
  config: function( data ){
    this.supr(data);
    //other logic
  }
});

```



<a name="init"></a>
## 初始化组件

Regular组件的初始化与Web Component非常类似，可以以两种方式初始化。

以组件Pager为例:

```js
var Pager = Regular.extend({
  name: 'pager'
  // other options
})
```

下面两种初始化方式是等价的。


#### 1. 通过js直接初始化

```js
var pager = new Pager({
    data: {
        current: '1'
    }
})
pager.$on('nav', someCallback)
```

#### 2. 模板中初始化

```html
<pager current=1 on-nav={someCallback($event)} />
```

第二种方式就是常说的 __内嵌组件__ 。我们可以在模板中利用`<pager/>` 来初始化的秘诀是`name`属性。`name`是一个全局配置，如果你需要在某个组件下用自定义的名字，可以使用[Component.component]({{api}}#component)接口。

```js
Component.component('custom-pager', Pager);
```

component接口和directive等一样，都有[单向影响性](../advanced/modular.md)，只影响Component及其子类。


## 关于内嵌组件


### 一些内嵌组件的属性声明细节

- 默认传入属性都会成为data的成员，例如
  ```html
    <pager total=100 current={1} show={show} ></pager> 
  ```
  相当于`data.total='100'`, `data.current=1` 和 `pager.data.show=this.data.show`（this指向模板所在组件）。

- __value缺省为boolean值`true`__，如
  ```html
  <pager show ></pager>
  ```
  如上例的property show没有设置值，则默认`data.show` 为 `true`
- 连缀格式转驼峰，如：
  ```html
  <pager show-modal={true} isHide={hide}/>
  ```
  则`show-modal`会转换为`showModal。但是`isHide`这种驼峰式的写法仍然支持，并不做变换
- `on-[eventName]`自动转换为[组件事件绑定](basic/event.md)
  ```html
    <pager on-nav={this.nav($event)}></pager>
  ```
  相当于`pager.$on('nav', this.nav.bind(this))`
- 特殊属性`ref`和`isolate`，请参考『[获取内部节点和组件](component/ref.md)』 和 『[组件隔离](component/isolate.md)』
  
