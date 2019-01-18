# 事件

Regular 中事件分为两类

- DOM事件
- 组件事件

在大部分情况下，它们的使用方式和表现一致。

##  DOM 事件 {#dom}

> __DOM节点上__ 所有以 `on-` 开头的属性都会被当做DOM事件处理



### 基础DOM事件

__Syntax__ : `on-event={Expression}`

每次event触发时，表达式 `Expression` 都会被运行一次


__Example__:

```html
<button on-click={count = count + 1}> count+1 </button> <b>{count}</b>,
```


<script async src="//jsfiddle.net/leeluolee/qktenw5c/embed/js,result/"></script>

> __如果表达式执行后的值为false(===)，事件的默认行为将会被阻止__，当然你也可以通过[$event.preventDefault()](#event)来阻止事件的默认行为。




### 自定义DOM事件  {#custom-event}

比如`on-tap`, `on-hold`

__Usage__

`Component.event(event, fn)`


__Arguments__

* event:  自定义事件名
* fn(elem, fire)
  - elem:  被绑定节点
  - fire:  触发事件函数

注意如果需要做 __销毁工作__ ，与指令一样，你需要在 fn 中返回一个函数用来做销毁工作

__Example__

定义 `on-enter` 事件处理回车逻辑


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
```

```html
<!-- use in template -->
<textarea on-enter={this.submit($event)}></textarea>
```

__Tip:__ 模板中出现的 `this` 指向组件实例本身，回车后会运行实例的submit方法

<script async src="//jsfiddle.net/leeluolee/3ac62L4g/embed/js,result/"></script>

查看 [$event](#$event)了解更多

> 注意：除非是自定义事件，其它事件无论浏览器是否支持，都会通过addEventListener进行绑定


### 事件代理支持


`on-*`会在当前节点绑定事件，在某些情况下（比如大列表），这种方式不是很高效。

在这种情况下，我们可以尝试使用 `delegate-` 代替 `on-`，来避免潜在的性能问题，`delegate-` 只会绑定一次事件到 父节点 上


__Example__

```html
<div delegate-click="remove">Delte</div>   //Proxy way via delegate
<div delegate-click={this.remove()}>Delte</div> // Evaluated way via delagate
```


但是，需要注意的是，`delegate-` 并非是「银弹」

1. 避免在高频触发的事件中使用( 比如 `mouseover` )，这样反而会产生性能问题
2. 事件必须可冒泡
  - [自定义事件](#custom-event)请参考 zepto tap-event 的[实现](https://github.com/madrobby/zepto/blob/master/src/event.jsL274).
  - 部分事件天生没法冒泡，比如 IE 低版下的 `change`，`select` 等

### $event 对象 {#event}

`$event` 会在每次事件触发时注入到 `data.$event` 中，你可以直接在模板里使用它。


__Example__

<script async src="//jsfiddle.net/leeluolee/1o2gf4um/embed/js,result/"></script>


`$event`对象是被修正过的，在兼容 IE6 的前提下，你可以使用以下规范内的属性

0. origin:  绑定节点
1. target:  触发节点
2. preventDefault(): 阻止事件默认行为
3. stopPropagation(): 阻止事件冒泡
4. which
5. pageX
6. pageY
7. wheelDelta
8. event: __原始事件对象__

> 对于自定义事件，$event 即传入 fire 触发器的对象

## 组件事件

Regular 集成了一个轻量级的 Emitter，使得所有组件实例都可以使用以下接口来实现事件驱动的开发

- [component.$on](../intro/hello.html#start): 用于添加事件监听器
- [component.$off](../intro/what.html#start): 用于解绑事件监听器
- [component.$emit](../intro/what.html#start): 用于触发某个事件


__Example__


<script async src="//jsfiddle.net/leeluolee/h03acpfy/1/embed/js,result/"></script>

### 模板里声明组件事件绑定


与DOM事件绑定类似，声明式组件以 `on-` 开头的属性都会被视作事件绑定

假设已经注册了一个名为 `Pager` 的翻页器组件

```html
<Pager on-nav={ this.refresh($event) } />
```

<script async src="//jsfiddle.net/leeluolee/8pfa43ms/embed/js,result/"></script>

每当 `Pager` 组件通过 `$emit` 抛出`nav`事件，对应的 `this.refresh($event)` 就会被调用，执行组件上的 refresh 方法

是的，整个过程和 DOM 事件并无二样。但其中的 `$event` 代表 $emit 传入的__第一个__参数



### 内建生命周期内的组件事件

Regular 会在组件实例初始化过程的关键阶段抛出事件

1. `$config`: 会在 compile 之前触发
2. `$init` : 会在 compile 之后触发，此时，dom 结构已经生成，你可以通过 this.$refs 来获取了
3. `$destroy`: 会在组件被 destroy 时触发

> `$`前缀是为了标识内建事件


## 事件的共性

组件和DOM事件具有共性

### 事件绑定语法

- 表达式(e.g. `on-click={this.remove()}`)

  如果传入的是表达式，该表达式会在事件触发时被运行一次。

  __Example__
  ```html
  <div on-click={this.remove(index)}>Delte</div>
  ```

  这是一种最标准的写法，大多数时候你只会用到它

-  非表达式（e.g. `on-click="remove"`）

  简化写法，等价于 `on-click={this.$emit('remove', $event)}` ，事件会以同样的事件名和参数被再次抛出，相当于做了一次代理

  __Example__

<script async src="//jsfiddle.net/leeluolee/5hmawdcr/embed/js,result/"></script>


## 事件的不同点

1. 组件事件由 `$emit` 方法抛出，而 DOM 事件由浏览器抛出
2. DOM 事件由于 DOM 本身的特点，是可以冒泡的，而组件事件没有冒泡的机制
3. `$event` 在组件事件中是 $emit 传入的第一个参数，而在 DOM 事件中是封装过的事件对象


## 完整的事件绑定流程

![](https://p1.music.126.net/eHVTTZYK5El8xqv8Z5RcSg==/109951163389106097.png)
