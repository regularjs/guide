#  脏检查: 数据绑定的秘密


事实上，regularjs的数据绑定实现基于基于脏检查. 它非常接近于angularjs

> 脏检查即一种不关心你如何以及何时改变的数据， 只关心在__特定的检查阶段__数据是否改变的数据监听技术.

本节包含内容

- 什么是脏检查
- 脏检查是如何进行的
- 何时进行脏检查
- regularjs为何选择脏检查

这里会统一使用angularjs生态圈的术语，方便开发者理解


## 什么是脏检查

以插值`{post.title}`为例， 当Regular在compile阶段遇到这个语法数元素时， 内部的处理逻辑如下.

```javascript

walkers.expression = function( ast ){
  var node = document.createTextNode("");
  this.$watch(ast, function(newval){
    dom.text(node, "" + (newval == null? "": "" + newval) );
  })
  return node;
}

```

这段代码很好理解，即遇到插值时，我会创建一个textNode， 每当数据变化时，修改textNode的textContent值.

其中

- ast: 表达式: 即`post.title`, 反映在组件就是component.data.post.title.
- [$watch]({{reference}}?api-zh#watch): 添加一个数据监听器(watcher对象)



那么问题来了, 怎么判断值发生改变了？ 


## 脏检查如何进行？ 不提不提的Digest阶段


首先, 上例通过`$watch`接口产生的watcher对象看起来是这样的

```js

{
  get: function(context){...}  //获得表达式当前求值, 此函数在解析时，已经生成
  set: function(){} // 有些表达式可以生成set函数， 用于处理赋值, 这个一般用于双向绑定的场景
  once: false // 此监听器是否只生效一次
  last: undefined// 上一次表达式的求值结果
  fn: function(newvalue, oldvalue){} // 即你传入$watch的第二个参数, 当值改变时， 会调用此函数
  // ...
}

```


然后我们要提到内部的一个非常重要的阶段——digest阶段, 当系统进入此阶段时，将会进行数据检查, 它的处理流程如下: 


1. 标记`dirty = false`
2. 遍历所有通过`component.$watch`绑定的数据观察者watcher, 对比当前值`watcher.get(component)`与老值`watcher.last`
  - 如果值发生改变, 运行绑定的监听器 - `watcher.fn(newvalue, oldvalue)`, 并导致`__dirty__=true`. 设置`watcher.last=newvalue`
  - 进入下一个watcher的检查
3. 遍历检查一轮后， 如果`dirty===true`, 我们重新进入步骤1. 否则进入步骤4.
4. 完成脏检查

好， 现在我们了解数据检查的内部流程了， 但是__何时进入digest阶段__


## 何时进行脏检查

有基本的javascript基础的同学都知道， 在姗姗不来的ES7`Object.observe`方法没有到来时(但是别对`Object.observe`抱太大得期望， 它不会改变目前类MVVM框架的格局， 我后续会写一篇文章说明)， 当我们对对象属性进行赋值时， 我们是无法知道数据发生改变了的， 所以digest阶段必然是 __主动进入的__ .

在Regular中，digest阶段是由[`$update`]({{reference}}?api-zh#update)方法触发的.

__Example__

```js
var component = new Regular();

component.data.name = 'leeluolee'

// you need call $update to Synchronize data and view 
component.$update(); 


```


值得庆幸的是，大部分情况下都会自动进入digest阶段.比如事件、timeout模块等等. 

```html
<div on-click={blog.title='Hello'}>{blog.title}</div>
```

当点击节点后， 内容区会变成Hello.



## 题外话： 为什么使用脏检查

1. 脏检查完全不关心你改变数据的方式, 而常规的set, get的方式则会强加许多限制
2. 脏检查可以实现批处理完数据之后，再去统一更新view.
3. 脏检查其实比 GET/SET 更容易实现. 脏检查是个单向的检查流程(请不要和双向绑定发生混淆), 可以实现__任意复杂度的表达式支持__. 而get/set的方式则需要处理复杂依赖链 , 基本上表达式支持都是阉割的(使用时就像踩雷).

但是很显然， 脏检查是低效的, 它的效率基本上取决于你绑定的观察者数量, 在Regular中， 你可以通过[`@(Expression)`]({{ref}}?syntax-zh#bind-once)元素来控制你的观察者数量.

然而结合这种类mvvm系统中， 他又是高效的. 因为监听模式带来了dom的局部更新， 而dom操作恰恰又是隐藏的性能瓶颈所在.

> __Regular实际上在解析时，已经提取了表达式的依赖关系， 在未来Observe到来时， 可以调整为脏检查 + 依赖计算的方式__




