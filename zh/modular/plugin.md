# regularjs的插件化

本小节会说明, 一种推荐的定义插件的方式， 它包括

- regularjs推荐的插件定义
- reuglarjs中已经内置的插件


## 简介

angular中模块化的解决方案是`angular.module()`和依赖注入, 一个模块可以有factory可以有filter可以有directive等等.

在regularjs中不可能照搬这种方式, 这是因为

- regularjs中没有`$rootScope.$digest()`这种全局性的__解药__无脑的促使所有绑定进入数据检查阶段，regularjs组件的生命周期都是独立的, 这就决定了必须让扩展建立与组件的关系.

  比如angular的`$timeout`之类的实现只需在定时器完成后`$rootScope.$digest()`即可进入全局的数据检查, 而regular中[timeout](#timeout)之后必须调用组件的`$update()`才进入组件本身的数据检查阶段,即需建立与组件的关系.


- 模块插件应该是与组件无关的, 绑定只应该在被使用时发生, 这样才是可复用的模块插件.


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


为了更统一, 所有Component都有一个`use`函数来统一'使用'插件, 如上例可以写成

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
  
  定时器函数(setTimeout), 在fn调用会进入本组件的数据检查，返回计时器id 

- `Number $interval(fn, delay)`: 
  
  周期定时器函数(setInterval), 在fn调用后会进入本组件的数据检查，返回计时器id


timeout插件非常简单, 简单到可以直接列出全部源码

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










