# event——ui事件体系



## 1. 对于未自定义过的ui事件
  与ractive类似，事件指令会默认在指令所在节点绑定对应事件，比如`on-click={{this.add()}}`会在节点绑定`click`事件。与ractive不同的是，每次ui事件触发时，regularjs不是以代理的形式，而是与angular一样，运行一次绑定的表达式。

  即所有dom中的click、change、keydown等事件都可以直接on-xx的方式进行绑定

  __Example__:

  ```javascript
  new Regular({
    template: 
    "<button on-click={count = count + 1}> count+1 </button> \
      <b>{count}</b>",
    data: {count:1}
  }).$inject(document.body);
  ```

  [|DEMO|](http://jsfiddle.net/leeluolee/y8PHE/1/)


## 2. 注册自定义事件 `Component.event(event, handler)`

handler接受两个参数:

-elem   attached element
-fire   一个函数，每当这个函数调用，将会触发这个自定义事件，传入fire的参数则会作为[`$event`](#$event)对象

注意如果需要做 __销毁工作__，与指令一样，你需要返回一个销毁函数

> 当不传入handler时，event是一个getter方法，用于获取事件处理定义


__Example__ 

Regular内置的on-enter的实现，它在敲击回车时会进行触发


```javascript

  Regular.event('enter', function(elem, fire){
    function update(ev){
      if(ev.which == 13){ 
        ev.preventDefault();
        fire(ev); // if key is enter , we fire the event;
      }
    }
    dom.on(elem, "keypress", update);
    return function destroy(){ // return a destroy function
      dom.off(elem, "keypress", update);
    }
  });
```

注意这里我们返回了一个destroy函数用来清理此ui事件绑定

## 3. 代理ui事件到[emitter](./message.md) 或直接运行表达式

取决于你传入的值是表达式插值还是普通属性，regularjs会做不同的响应处理，例如

1. 表达式(e.g. `on-click={this.remove()}`)
  
  如果传入的是表达式，与angular类似，一旦事件触发，此表达式会被运行一次。

  __Example__


  ```html
    <div on-click={this.remove(index)}>Delte</div>
  ```

  调用组件的remove函数


2. 普通属性 (e.g. `on-click="remove"`)
  事件会被代理到组件的事件系统中，你可以使用`$on`去处理此事件

  __Example__

  ```html
    <div on-click="remove">Delte</div>
  ```

  then handle the proxy event with `$on`


  ```javascript
  var Component = Regular.extend({
    template:'#example',
    init: function(){
      this.$on("remove", function($event){
          // your logic here
      })
    }
  })

  ```

无论何种方式，都会在事件触发后进入脏检查阶段，所以你无需去手动调用`$update`.


## 4. 天生的事件代理支持

所有的`on-*`都会在节点上绑定对应事件，在某种情况下(比如大列表)，这种方式不是很高效。

你可以使用`delegate-`来代理`on-` 来避免可能的性能问题。regularjs只会绑定唯一的事件到组件的第一父元素(无论你是如何$inject的)来处理组件内的所有代理事件

__Example__

```html
<div delegate-click="remove">Delte</div>   //Proxy way via delegate
<div delegate-click={this.remove()}>Delte</div> // Evaluated way via delagate
```


从用户使用角度讲，`on-`和`delegate-` 完全等价，但是各有利弊

1. 正如你在`jQuery.fn.delegate`中学到的，如果组件结构复杂，避免在那些高频触发的事件中使用事件代理(mouseover等)
2. 如果事件是[自定义事件](#custom-event。事件对象必须是可冒泡的，这样事件代理才能生效，你可以参考zepto's tap-event的[实现](https://github.com/madrobby/zepto/blob/master/src/event.js#L274).
3. 某些事件天生没法冒泡，比如ie低版下的chang。select等。所以也就无法使用`delegate-`



<a name="$event"></a>
## 5. 事件对象`$event`

Regular推崇的是声明式的事件处理，一般不建议操作事件对象，如果你确实需要。那你可以使用`$event` 这个临时变量，它会在每次事件触发时注册在作用域上，对于非自定义事件，则`$event`传入fire的对象。

__Example__

```javascript
new Regular({
  template: 
  "<button on-click={this.add(1, $event)}> count+1 </button> \
    <b>{count}</b>",
  data: {count:1}
  add: function(count, $event){
    this.data.count += count;
    alert($event.pageX)
  }
}).$inject(document.body);
```

[|DEMO|](http://jsfiddle.net/leeluolee/y8PHE/3/)


> <h5>Tip</h5>
> `$event`对象是被修正过的，在兼容IE6的前提下，你可以使用以下规范内的属性
> 1. target
> 2. preventDefault()
> 3. stopPropgation
> 4. which 
> 5. pageX
> 6. pageY
> 7. wheelDelta

你可以使用`$event.event`来获得原始事件对象



## 其它小技巧

### 1. 你可以在节点中绑定多个同名事件

  既然regularjs拥有独立的parse过程，而不是angular的插入到dom后再进行的link操作，你可以声明多个同名事件到同一个中


### 2. 你可以使用 `if` 在模板上实现绑定和解绑事件

  ```html
  <input {#if test===0 } on-click={{test = 1}} {{/if}} />
  ```

