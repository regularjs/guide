# 模块化 - 基于原型继承

大型工程里，对于封装隔离性会有较高的要求。Regular 提供了基于原型继承的工程化隔离方案。在文章开头，会先介绍下 Regular 的继承体系。

## Regular的继承体系

> Regular.extend

Regular 的类式继承简化自 __[&#x261E;ded/klass](https://github.com/ded/klass)__, 只保留了其中两个接口。

- [extend](../reference/api.md#extend):  从父组件派生一个可重用组件
- [implement](../reference/api.md#implement):  扩展当前组件的原型对象


### 与 klass 的相同点

`Regular.extend` 返回一个构造函数此构造函数拥有以下特点

- 返回子类同时也拥有`extend`, `implement`方法。

```javascript
const Component = Regular.extend({
    say: function(){},
    run: function(){}
});
const SubComponent = Component.extend();

SubComponent.implement({
    run: function(){ }
})
```

- 在方法中可以通过`this.supr()`来调用父类的同名函数

```js

const ChildComponent = Component.extend({
    say: function(){
        this.supr() // call Component.prototype.say.
        console.log("sub say");  // other logic
    }
})

ChildComponent.implement({
    run: function(){
        this.supr() // call Component.prototype.run
    }
})

var component = new ChildComponent();
component.run（);

```


>  __Tips__:使用exend、implement之外的方式扩展的原型方法无法使用`this.supr()`


### 与klass的不同点

由于extend同时又是组件定义的接口，所以在extend时，Regular同时会做一些预处理操作:


- 预解析传入的template参数。保证由这个类的模板只会被解析一次。

- 子类同时拥有 component, directive, filter, event, animation函数，用来[扩展组件功能](#extension)

- 如果定义时传入了 name，则为此组件注册组件名，使得可以以 [内嵌组件](../basic/component) 的形式使用此组件

```js
const Modal = Regular.extend({
    name: 'Modal'
})

```

> __这些伴生逻辑__ 也决定了，当前版本下无法使用纯粹 ES6 的 class 来实现 Regular 组件定义 


## 组件的功能扩展以及命名空间 {#extension}

根据 [API文档](../../reference/api.md) 的介绍，我们知道了所有 Regular 组件都支持这几种扩展

- filter：过滤器扩展
- directive：指令扩展
- event：扩展一个自定义事件
- animation：扩展一个新的[动画command](../animation.md)
- component：注册组件，使其可以声明式使用
- implement: 扩展组件的实例方法或属性

这些扩展都有以下特点


### 即是 set 又是 get 方法

上述5个接口其实是由一个工厂函数产生，简单示意如下例所示

```js

function factory(){
  const cache = {}; 
  return function(name, definition){

    if(typeof definition === 'undefined') return cache[name] 

    cache[name] = definition
  }
}

Regular.directive = factory();
```

所以，扩展定义可以使用同名接口获取


```js
const filter1 = {
  set(){ },
  get(){ }
}

Regular.directive('filter1', filter1)

console.log(Regular.directive('filter1') === filter1) // true

```



### 单向影响性 {#one-way}

这几位的共同特点就是 __扩展只对定义它的Component及其子类可见__ 如


```javascript

Regular.event('tap', tap)

var Child = Regular.extend();
var SubChild = Children.extend();

Child.event('tap2', tap2)

alert( Regular.event('tap') === tap )
// Child's extension will not affect Parent
alert(Regular.event('tap2') === undefined)

alert(Child.event('tap') === tap)
alert(Child.event('tap2') === tap2)

// but affect SubChild
alert(SubChild.event('tap2') === tap2)

// filter，directive is the same
```

即父类无法获得子类定义的扩展，而反之可以，这个最基本的概念是实现 Regular 的模块化的第一步。

对于implement无需多做解释，这是原型继承的基本原理，而对于其它几个接口，是通过定义的原型继承`Object.create()`来实现的


> __单向影响性__ 是实现封装隔离性的第一步。


### 建立项目内独立的隔离空间

对于建立独立的隔离空间，聪明的同学可能已经想到了: 

> 即定义一个不会被实例化的组件来替代Regular顶层空间。

```javascript
var YourNameSpace = Regular.extend()

YourNameSpace.filter().directive().event() //....

var Component = YourNameSpace.extend();
```

这样，独立项目内的扩展就不会影响到产品中的其它Regular组件了，而扩展自NameSpace的组件可以拥有所有组件内的功能扩展。

### Regular模块

基于上述描述，如果将一系列过滤器、指令、事件作为一个整体封装起来，就可以称之为是一个独立的功能模块。

一个典型的模块可以这样书写。

```javascript

function FooModule(Componenet){
  Component.implement()// implement method
    .filter()          // define filter
    .directive()       // define directive
    .event()           // define custom event
}

var YourComponent = Regular.extend();

FooModule(YourComponent);   //  bind(局部)
FooModule(Regular);         //  bind(全局)

```

为了更统一，Regular提供了一个`use`方法来统一'使用'模块，如上例可以写成

```javascript

// 局部
YourComponent.use(FooModule);

// 全局
Regular.use(FooModule);

```

### Regular预定义模块

预定义模块都可以直接用`Component.use('模块名')`的方式使用


<a name="timeout"></a>
### 模块名: '$timeout'

timeout模块在组件中扩展了两个方法

- `Number $timeout(fn, delay)`: 
  
  定时器函数(setTimeout)，在fn调用会进入本组件的数据检查，返回计时器id 

- `Number $interval(fn, delay)`: 
  
  周期定时器函数(setInterval)，在fn调用后会进入本组件的数据检查，返回计时器id


timeout模块非常简单，简单到可以直接列出全部源码

```js
function TimeoutModule(Component){

  Component.implement({
    $timeout: function(fn, delay){
      delay = delay || 0;
      return setTimeout(function(){
        fn.call(this);
        this.$update(); //enter digest
      }.bind(this), delay);
    },
    $interval: function(fn, interval){
      interval = interval || 1000/60;
      return setInterval(function(){
        fn.call(this);
        this.$update(); //enter digest
      }.bind(this), interval);
    }
  });
}

```

__Example__

一个简单的计数器

```javascript
const Counter = Regular.extend({
  template: `
  	<h2>{count}</h2>
    <a href="#" on-click={this.start()}>start</a> 
    <a href="#" on-click={this.stop()}>stop</a>`,
  start: function() {
    if (this.tid) return;
    this.tid = this.$interval(function() {
      this.data.count++;
    }, 500);
  },
  stop: function() {
    this.data.count = 0;
    clearInterval(this.tid)
    this.tid = null;
  }
}).use('$timeout'); // <== use timeout

new Counter({
  data: { count: 0 }
}).$inject('body');


```


<script async src="//jsfiddle.net/leeluolee/9z18fg5d/embed/result,js/"></script>





## 小结

经过本章的学习，我们理解了

- 每一个Regular组件类都拥有以下类方法用来定义或扩展组件能力
    1. extend
    2. implement
    3. directive
    4. filter
    5. event
    6. animation
    7. component
    8. use

- 扩展都具有[单向性](#one-way)限制，使得以上 都只会作用于本组件或子类组件

- 鉴于这个单向性，我们可以在每个工程中定义一个“命名空间”来实现本工程对外的隔离性

- 对于作为整体的扩展需求，我们可以定义一个模块，并使用use来使用这个模块


