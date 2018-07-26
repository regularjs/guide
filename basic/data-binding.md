
# 数据监听和计算属性

大部分情况，通过在模板中声明表达式，Regular 会通过 vm 自动完成 view 与 model 的绑定，对于自定义的监听需求，你可以通过 [数据监听](#watch)实现

在本文的末尾，也有对[数据绑定原理：脏检查](#dirty-check)的介绍。

Regular 内部的所有监听都是通过 [$watch API](../reference/api.md#watch)， 你也可以使用这个 API 来实现自定义数据监听

## 基本用法

```js

new Regular({
  template: `
    <intpu r-model={value} />
  `,
  config( ){
    this.$watch('value', value=>{
      this.data.value = value.slice(0, 5);
    })
  }
})

```

<script async src="//jsfiddle.net/leeluolee/poryh5sb/embed/result,js/"></script>

这个例子实现了 最多只能输入5个字符 的效果。


## 深度监听 {#deep}

通过传入`deep: true` 可以做到对象的深层监听

```js
new Regular({
  template:`
  <input r-model={blog.title} />
  <input r-model={blog.content} />
  {blogStr}
  `,
  config(data){
    data.blog = {title: '', content: ''};
    this.$watch('blog', (blog)=>{
      // blog.title or blog.content is change
      data.blogStr = JSON.stringify(blog)
    }, {
      deep:true
    })
  }
})
```

<script async src="//jsfiddle.net/leeluolee/oa8uz6c4/embed/result,js/"></script>

注意 Regular __目前只能监听一级属性__，太复杂的属性建议使用不变数据结构，或 监听序列化后的值的方式 ( 通过`JSON.stringify`，这种方式仅针对数据不是太复杂的场景 ) 

```js

this.$watch('JSON.stringify(blog)', (blogStr)=>{
  const blog = this.data.blog; // blog is change
})

```


## 直接触发本监听的脏检查 {#init}

你可以直接通过`init:true`参数，强制触发当前监听器的脏检查，而不用等待下一轮 [$digest](#digest) 流程

```js

Regular.extend({
  init(){
    this.$watch('blog', ()=>{
      console.log('同步检查这个watcher')
    },{
      init: true
    })
    console.log('晚于watch回调执行')
  }
})

```







## 数据监听的秘密 - 脏检查 {#dirty-check}


类似Angular ，Regular 的数据绑定基于脏检查实现。

> 脏检查即一种不关心你如何以及何时改变的数据，只关心在**特定的检查阶段**数据是否改变的数据监听技术。

本节包含内容

- [什么是脏检查](#what)
- [脏检查是如何进行的](#digest)
- [何时进行脏检查](#when)
- [为什么选脏检查](#why)
- [监听器的稳定性](#stable)

> 统一使用 Angular 生态圈的术语，方便开发者理解


## 什么是脏检查 {#what}

以[文本插值](./interpolation.html#text) `{post.title}`为例，在compile阶段，Regular 内部的处理逻辑如下。

```javascript

walkers.expression = function( expression ){
  var node = document.createTextNode("");
  this.$watch(expression, function(newval){
    dom.text(node, "" + (newval == null? "": "" + newval) );
  })
  return node;
}

```

这段代码很好理解: 遇到文本插值时，Regular 会创建一个 textNode，每当数据变化时，修改 textNode 的 textContent 值。

__说明__

- expression: 表达式: 即`post.title`，反映在组件就是component.data.post.title.
- [$watch](../reference/api.md#watch): 添加一个数据监听器(watcher对象)


__那么问题来了，怎么判断值发生改变了？__


## 脏检查如何进行 - digest流程 {#digest}

首先，上例通过`$watch`接口产生的watcher对象看起来是这样的

```js

{
  get: function(context){...}  //获得表达式当前求值，此函数在解析时，已经生成
  set: function(){} // 有些表达式可以生成set函数，用于处理赋值，这个一般用于双向绑定的场景
  once: false // 此监听器是否只生效一次，如 {@(expression)}
  last: undefined// 上一次表达式的求值结果
  fn: function(newvalue, oldvalue){} // 即你传入$watch的第二个参数，当值改变时，会调用此函数
  // ...
}

```


这是必须引出内部的重要阶段 - __digest阶段__ ，当系统进入此阶段时，将会进行数据检查，它的处理流程如下: 


1. 标记 `dirty = false`
2. 遍历数据观察者watcher，一旦有[监听器值发生改变](#checkSingle)，就标记`dirty=true`
3. [检查一轮后](#checkAll)，如果 `dirty===true` ，我们重新进入步骤1. 否则进入步骤4.
4. 完成脏检查


### checkSingleWatcher

先来看下简化后的检查单个监听器逻辑 `checkSingleWatcher`

```js
function checkSingleWatcher( watcher ){

  let newValue = watcher.get( this )

  if( newValue !== watcher.last ) {

    watcher.fn( newValue, watcher.last )
    watcher.last = newValue

  }

  return false
}
```

### checkWatchers

下例是简化后的检查所有监听器的逻辑

```js

function checkWatchers( isStable ){

  var watchers = isStable? 
    this._stableWatchers : this._watchers;
  var children = this._children;  
  var dirty = false;

  // 只要有一个监听器有变化，则认为dirty
  watchers.forEach( watcher=>{
    if( checkSingleWatcher(watcher) )  
      dirty = true
  })
  
  //递归遍历所有子组件的监听器 
  children.forEach( comp=> {
    if(comp.checkWatchers(isStable)) 
      dirty = true 
  }) 

  return dirty;

}


```


好，现在我们了解数据检查的内部流程了，但是__何时进入digest阶段__


## 何时进行脏检查 {#when}

由于脏检查没有任何数据劫持逻辑(比如Vue)，数据模型本身是无状态的，所以是无法得知数据的变更时机的，可以猜测 digest 阶段必然是 __主动进入的__ 。

在 Regular 中，digest 阶段是由[`$update`](../reference/api.md#update)方法触发的。

__Example__

```js
var component = new Regular();

component.data.name = 'leeluolee'

// you need call $update to Synchronize data and view 
component.$update(); 

```


值得庆幸的是，大部分情况下都会自动进入 digest 阶段。比如事件、timeout 模块等等。

```html
<button on-click={blog.title='Hello'}>{blog.title}</button>
```


<script async src="//jsfiddle.net/leeluolee/19mzaxe2/2/embed/result,js/"></script>



##  为什么使用脏检查 {#why}

1. 脏检查完全不关心你改变数据的方式，而常规的set, get的方式则会强加许多限制
2. 脏检查可以实现批处理完数据之后，再去统一更新view.
3. 脏检查其实比 GET/SET 更容易实现。脏检查是个单向的检查流程(请不要和双向绑定发生混淆)，可以实现__任意复杂度的表达式支持_。而get/set的方式则需要处理复杂依赖链，基本上表达式支持都是阉割的(使用时就像踩雷).

但脏检查有时是低效的，因为每次检查都会无脑的遍历（Regular已经对Loop做了优化）。

但与MVVM结合时，他又是高效的。因为数据监听模式带来了DOM的局部更新(而且是准确更新，而不是Virtual DOM那样需要做 `diff-patch` 操作)，而DOM操作恰恰又是隐藏的性能瓶颈所在。




## 监听器的稳定性{#stable} 

Regular 的数据监听器分为两类

- __不稳定的监听器__: 即监听器回调运行可能导致别的数据变动，此时我们应该再进行`$digest`流程，才能判断值是否真的稳定
  ```js
  this.$watch('title', (title)=>{
    this.data.summary = title.slice(0, 10);
  })
  ```
  这个监听器触发变更时，会导致`summary`的字段的变更。


- __稳定的监听器__: 即回调运行不会导致别的数据变动，比如大部分内部实现的指令和插值等监听器
  ```js
  this.$watch('title', (title)=>{
    this.$ref.container.setAttribute('data-title', title);
  })
  ```
  这个监听器触发变更时，只是修改了DOM，但并不影响别的字段

实际Regular的脏检查流程是

- 检查不稳定监听器直到稳定
- 检查 **一次** 稳定的监听器


你也可以通过传入`stable:true`来标记这个监听器是稳定的，来得到更好的性能表现

__Example__

```js

  this.$watch('title', (title)=>{
    this.$ref.container.setAttribute('data-title', title );
  }, {stable: true})

```