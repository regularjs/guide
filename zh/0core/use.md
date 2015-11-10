#regular的封装和插件化策略

良好的模块化和封装性支持是可以在大型项目中使用的必然要求。regularjs中只有一个顶层对象`Regular`，它即是命名空间又是组件的基类，这种情况下如何实现封装呢？


## 扩展接口的单向影响性

之前小节已经提到了Component拥有几个扩展接口

* [filter](filter.md): 定义一个过滤器，在表达式中可以使用
* [directive](directive.md)`: 定义一个指令扩展节点能力
* [event](event.md): 自定义一个ui事件，例如`drag`
* [animation](animation.md): 自定义动画
* [implement](class.md): 在组件的原型添加一个函数


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


> __tips__: 
>对于implement无需多做解释，这是原型继承的基本原理，而对于其它几个接口，regular会让父子类的容器对象(比如event都是保存在在_events私有对象中)做一次原型继承`Object.create()`

即如果需要全局可用的扩展可以直接定义在Regular中，而私有扩展不会影响到外围的其它组件




## 建立项目内独立的隔离空间

对于建立独立的隔离空间，聪明的同学可能已经想到了

> 即定义一个什么都不做的组件来替代Regular顶层空间来作为扩展的容器

```javascript
var YourNameSpace = Regular.extend()

YourNameSpace.filter().directive().event() //....

var Component = YourNameSpace.extend();
```

这样，独立项目内的扩展就不会影响到产品中的其它Regular组件了


## use——regular的模块(插件)化

angular中模块化的解决方案是`angular.module()`和依赖注入，一个模块可以有factory可以有filter可以有directive等等。

在regular中不可能照搬这种方式，这是因为

- regular中没有`$rootScope.$digest()`这种全局性的__解药__无脑的促使所有绑定进入数据检查阶段，regular组件的生命周期都是独立的，这就决定了必须让扩展建立与组件的关系。

  >比如angular的`$timeout`之类的实现只需在定时器完成后`$rootScope.$digest()`即可进入全局的数据检查，而regular中[timeout](#timeout)之后必须调用组件的`$update()`才进入组件本身的数据检查阶段，即需建立与组件的关系。


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
### 插件名: 'timeout'

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
}).use('timeout'); // <== use timeout

new Counter({data: {count:0}}).$inject('#app');

```


[|DEMO|](http://fiddle.jshell.net/leeluolee/4AzR6/)











