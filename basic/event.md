# 事件

Regular 中事件分为两类

- DOM事件
- 组件事件 

大部分情况下，它们使用和表现都一致。

##  DOM 事件 {#dom}

> 所有 __DOM节点上__ 的`on-`开头的属性都会被作为DOM事件处理 



### 基础DOM事件 

__Syntax__ : `on-event={Expression}`

每当事件触发时，表达式`Expression` 会被运行一次


__Example__:

```html
<button on-click={count = count + 1}> count+1 </button> <b>{count}</b>,
```


<script async src="//jsfiddle.net/leeluolee/qktenw5c/embed/js,result/"></script>

> __表达式的值如果===false，事件将会被阻止__，当然你也可以通过[$event.preventDefault()](#event)来阻止事件。




### 自定义DOM事件  {#custom-event}

比如`on-tap`, `on-hold`

__Usage__

`Component.event(event, fn)` 


__Arguments__

* event:  自定义事件名 
* fn(elem, fire)
  - elem:  被绑定节点
  - fire:  事件触发函数 

注意如果需要做 __销毁工作__ ，与指令一样，你需要返回一个销毁函数

__Example__

定义`on-enter`事件处理回车逻辑


```js
var dom = Regular.dom;

Regular.event('enter', function(elem, fire){
  function update(ev){
    if(ev.which == 13){ // ENTER key
      ev.preventDefault();
      fire(ev); // if key is enter , we fire the event;
    }
  }
  dom.on(elem, "keypress", update);
});

// use in template

```

```html
<textarea on-enter={this.submit($event)}></textarea>
```

__Tip:__ 模板 `this` 指向组件本身，回车后实际会运行组件的submit方法

<script async src="//jsfiddle.net/leeluolee/3ac62L4g/embed/js,result/"></script>

查看 [$event](#$event)了解更多

> 注意除非是自定义事件，其它事件无论浏览器支持，都会通过addEventListener进行绑定


### 事件代理支持


`on-*`会直接在节点上绑定对应事件，在某些情况下(比如大列表)，这种方式不是很高效。

可以使用 `delegate-` 来代理 `on-`  来避免可能的性能问题，它只会绑定一个事件到 rootParent 


__Example__

```html
<div delegate-click="remove">Delte</div>   //Proxy way via delegate
<div delegate-click={this.remove()}>Delte</div> // Evaluated way via delagate
```


`delegate-`的并非是「银弹」

1. 避免使用在高频触发的事件( `mouseover` )，这样反而会产生性能问题
2. 事件必须可冒泡
  - [自定义事件](#custom-event)请参考zepto's tap-event的[实现](https://github.com/madrobby/zepto/blob/master/src/event.jsL274).
  - 部分事件天生没法冒泡，比如IE低版下的`change`，`select`等

### $event 对象 {#event}

`$event` 会在每次事件触发时注入到 `data.$event` 中，即你可以在模板里直接使用它。


__Example__

<script async src="//jsfiddle.net/leeluolee/1o2gf4um/embed/js,result/"></script>


`$event`对象是被修正过的，在兼容 IE6 的前提下，你可以使用以下规范内的属性

0. origin:  绑定节点
1. target:  触发节点
2. preventDefault(): 阻止默认事件
3. stopPropagation(): 阻止事件冒泡
4. which
5. pageX
6. pageY
7. wheelDelta
8. event: __原始事件对象__

> 对于自定义事件，$event 即传入 fire 触发器的对象

## 组件事件

Regular 集成了一个轻量级的 Emitter，使得所有组件都可以使用以下接口来实现事件驱动的开发

- [component.$on](../intro/hello.html#start): 用于添加事件监听器
- [component.$off](../intro/what.html#start): 用于解绑事件监听器
- [component.$emit](../intro/what.html#start): 用于触发某个事件


__Example__


<script async src="//jsfiddle.net/leeluolee/h03acpfy/1/embed/js,result/"></script>

### 模板里声明组件事件绑定


与DOM事件绑定类似，声明式组件的`on-`开头的属性会被视作是事件绑定指令

假设已经注册了一个名为`pager`的翻页器组件

```html
<Pager on-nav={ this.refresh($event) } />
```

<script async src="//jsfiddle.net/leeluolee/8pfa43ms/embed/js,result/"></script>

每当`Pager`组件通过`$emit` 抛出`nav`事件，对应的`this.refresh($event) `就会被调用，即执行组件上的 refresh 方法

是的，和DOM事件并无二样。但其中`$event`代表$emit传入的__第一个__参数



### 内建生命周期内的组件事件

regularjs会在初始化时的关键阶段抛出事件

1. `$config`: 会在 compile 之前触发
2. `$init` : 会在 compile 之后触发，此时，dom结构已经生成，你可以通过ref来获取了
3. `$destroy`: 会在组件被 destroy 时触发

> `$`前缀是为了标示内建事件


## 事件的共性

组件和DOM事件具有共性

### 回调方式取决于你传入的属性值

取决于你传入的值是表达式插值还是普通属性，Regular 会做不同的响应处理，例如

- 表达式(e.g. `on-click={this.remove()}`)
  
  如果传入的是表达式，此表达式会被运行一次。
  
  __Example__
  ```html
  <div on-click={this.remove(index)}>Delte</div>
  ```

  
  一般来讲推荐这种方式来处理事件。
  


-  非表达式（e.g. `on-click="remove"`）

  这种方式等价于 `on-click={this.$emit('remove', $event)}` ，事件会被代理代理到对应事件名
  
  __Example__

<script async src="//jsfiddle.net/leeluolee/5hmawdcr/embed/js,result/"></script>


## 事件的不同点

1. 组件事件是由`$emit`方法抛出，而DOM事件由浏览器抛出
2. DOM 事件由于 DOM 本身的特点是可以冒泡的，但是组件事件没有冒泡这一机制。
3. `$event`在组件事件中是$emit传入的第一个参数，而DOM事件中是封装过的事件对象


## 完整的事件绑定流程

![](https://p1.music.126.net/eHVTTZYK5El8xqv8Z5RcSg==/109951163389106097.png)

