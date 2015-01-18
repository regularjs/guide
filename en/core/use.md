#Encapsulation and Plugin in regularjs

Regularjs is very efficient for developing, it also provides basic encapsulation which is important during the deveopment in large project.

## Extension in regularjs is one-way influence

in previous chapter, we have learned four methods for extension:

* [Component.filter](filter.md)
* [Component.directive](directive.md)`
* [Component.event](event.md)
* [Component.implement](class.md)


They have a common feature: the extension is only __available to current Component and its SubComponent__, which is the basic of encapsulation.

__Exmaple__

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



## Create unique namespace in every project

you can defined a void Component as NameSpace instead of Regular , then extension is only available in this NameSpace

```javascript
var YourNameSpace = Regular.extend()

YourNameSpace.filter().directive().event() //....

var Component = YourNameSpace.extend();
```

now, your extension will not affect other project.


## `use` — the regularjs's Plugin System

All methods introduced above will create connection with specified Component, __but for reusing, a plugin must be Compnent-independent, the connection should be created during the using of plugin__.


so, the general plugin will be written like this:

```javascript

function FooPlugin(Component){
  Component.implement()// implement method
    .filter()          // define filter
    .directive()       // define directive
    .event()           // define custom event
}

var YourComponent = Regular.extend();

FooPlugin(YourComponent);   // lazy bind(private)
FooPlugin(Regular);         // lazy bind(global)

```


For consistency, every Component have a method named `use` to active a plugin. you can use the `FooPlugin` like this.

```javascript

YourComponent.use(FooPlugin);

// global
Regular.use(FooPlugin);

```




## Some Builtin Plugin

Every builtin plugin have a registered name, you can simply pass the name to `use`.


<a name="timeout"></a>
### name: 'timeout'

timeout

- `Number $timeout(fn, delay)`:

  just a wrap for setTimeout, when time is up, the digest-phase of the component will be triggered.

  return id for clearTimeout

- `Number $interval(fn, delay)`:

  just a wrap for setInterval, every step the digest-phase of the component will be triggered.

  return id for clearInterval.


the source code of the TimeoutPlugin.

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

a simple Counter

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



<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/4AzR6/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>














