# 轻量级的模块化

## 基于类的组件体系

regularjs的类式继承简化自著名的[&#x261E;ded/klass](https://github.com/ded/klass)

Regular只保留了其中两个接口(细节请看API):


- [extend]({{ref}}?api-zh#extend):  从父组件派生一个可重用组件
- [implement]({{ref}}?api-zh#implement):  扩展当前组件的原型对象


### regularjs中的'类'沿承自klass的特点

`Component.extend`返回的就是一个普通的构造函数，不过与原始[ded/klass]一样，此构造函数拥有以下特点

- 子类构造函数同时也拥有`extend`, `implement`方法。

```javascript
var Component = Regular.extend({
    say: function(){},
    run: function(){}
});
var SubComponent = Component.extend();

SubComponent.implement({
    run: function(){ }
})
```

- 在方法中可以通过`this.supr()`来调用父类的同名函数，避免了使用负担。继续上例。

```js

var ChildComponent = Component.extend({
    say: function(){
        this.supr() // call Component.prototype.say.
        console.log("sub say");  // other logic
    }
})

ChildComponent.implement({
    run: function(){
        this.supr() // call Component.prototype.say
    }
})

var component = new ChildComponent();
component.run（);

```


>  __Tips __:使用exend、implement之外的方式扩展的原型方法无法使用`this.supr()`





### 不同点

由于extend同时又是组件定义的接口，所以在extend时，regularjs同时会做一些预处理操作:


- 预解析传入的template参数。保证由这个类的模板只会被解析一次。

- 子类同时拥有component, directive, filter, event函数，用来[扩展组件功能](#extension)

- 如果定义时传入了name，则为此组件注册组件名，使得可以以 [内嵌组件](../basic/component.md) 的形式使用此组件

```js
var Modal = Regular.extend({
    name: 'modal'
})

```




-----

下一个小节，我们来看看我们如何来扩展组件的能力: 

- 指令directive
- 过滤器filter
- 自定义dom事件
- 注册内嵌组件



<a name="extension"></a>

## 组件的功能扩展以及命名空间

根据[API文档]({{api}})的介绍，我们知道了所有regularjs组件都支持这几种扩展。

1. filter: 过滤器扩展
2. directive: 指令扩展
3. event: 扩展一个自定义事件
4. animation: 扩展一个新的[动画command](../animation/command.md)
5. component: 注册一个组件，使其在当前组件的模板中可用。
6. implement: 扩展组件的原型方法


这些扩展拥有一些共性

## 扩展接口的单向影响性

这几位的共同特点就是 __[扩展只对定义它的Component及其子类可见]__ 如


```javascript
Regular.event('tap', tap)

var Child = Regular.extend();
var SubChild = Children.extend();

Child.event('tap2', tap2)

alert(Regular.event('tap') === tap)
// Child's extension will not affect Parent
alert(Regular.event('tap2') === undefined)

alert(Child.event('tap') === tap)
alert(Child.event('tap2') === tap2)

// but affect SubChild
alert(SubChild.event('tap2') === tap2)

// filter，directive is the same
```

即父类无法获得子类定义的扩展，而反之可以，这个最基本的概念是实现regular的插件化的第一步。

对于implement无需多做解释，这是原型继承的基本原理，而对于其它几个接口，是通过定义的原型继承`Object.create()`来实现的

__单向影响性__ 是实现regularjs封装性的第一步。

## 建立项目内独立的隔离空间

对于建立独立的隔离空间，聪明的同学可能已经想到了: 

> 即定义一个不会被实例化的组件来替代Regular顶层空间。

```javascript
var YourNameSpace = Regular.extend()

YourNameSpace.filter().directive().event() //....

var Component = YourNameSpace.extend();
```

这样，独立项目内的扩展就不会影响到产品中的其它Regular组件了，而扩展自NameSpace的组件可以拥有所有组件内的功能扩展。




## Regular插件

本小节会说明，一种推荐的定义插件的方式，它包括

- regularjs推荐的插件定义
- reuglarjs中已经内置的插件


### 简介

angular中模块化的解决方案是`angular.module()`和依赖注入，一个模块可以有factory可以有filter可以有directive等等。

在regularjs中不可能照搬这种方式，这是因为

- regularjs中没有`$rootScope.$digest()`这种全局性的__解药__无脑的促使所有绑定进入数据检查阶段，regularjs组件的生命周期都是独立的，这就决定了必须让扩展建立与组件的关系。

  比如angular的`$timeout`之类的实现只需在定时器完成后`$rootScope.$digest()`即可进入全局的数据检查，而regular中[timeout](#timeout)之后必须调用组件的`$update()`才进入组件本身的数据检查阶段，即需建立与组件的关系。


- 模块插件应该是与组件无关的，绑定只应该在被使用时发生，这样才是可复用的模块插件。


所以一个典型的插件的写法应该是这样的

```javascript

function FooModule(Componenet){
  Component.implement()// implement method
    .filter()          // define filter
    .directive()       // define directive
    .event()           // define custom event
}

var YourComponent = Regular.extend();

FooModule(YourComponent);   // lazy bind(private)
FooModule(Regular);         // lazy bind(global)

```


为了更统一，所有Component都有一个`use`函数来统一'使用'插件，如上例可以写成

```javascript

YourComponent.use(FooModule);

// global
Regular.use(FooModule);

```




## Regular预定义的插件

预定义插件都可以直接用`Component.use('插件名')`的方式使用


<a name="timeout"></a>
### 插件名: '$timeout'

timeout插件在组件中扩展了两个方法

- `Number $timeout(fn, delay)`: 
  
  定时器函数(setTimeout)，在fn调用会进入本组件的数据检查，返回计时器id 

- `Number $interval(fn, delay)`: 
  
  周期定时器函数(setInterval)，在fn调用后会进入本组件的数据检查，返回计时器id


timeout插件非常简单，简单到可以直接列出全部源码

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
var Counter = Regular.extend({
  template: '<h2>{count}</h2><a href="#" on-click={this.start()}>start</a> <a href="#" on-click={this.stop()}>stop</a>',
  start: function(){
    if(this.tid) return;
    this.tid = this.$interval(function(){
      this.data.count++;
    }, 500);
  },
  stop: function(){
    this.data.count = 0;
    clearInterval(this.tid);
  }
}).use('$timeout'); // <== use timeout

new Counter({data: {count:0}}).$inject('#app');

```


[|DEMO|](http://fiddle.jshell.net/leeluolee/4AzR6/)




## 小节

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

- 扩展都具有单向性，使得 implement/directive/filter/event/animation/component 都只会作用于本组件或子类组件

- 鉴于这个单向性，我们可以在每个工程中定义一个“命名空间”来实现本工程对外的隔离性

- 我们可以定义一个插件，并使用use来使用这个插件


