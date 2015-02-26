
#  DOM 事件


所有__节点上__的`on-`开头的属性都会被作为DOM事件处理 

__tip__: 由于Component.directive支持正则匹配属性名, 所以内部实现中DOM事件其实是一种特殊的指令, 它以`/on-\w+/`作为指令名，从而匹配出以on-开头的作为事件处理. [源码@TODO]()

这小节的内容主要包括

- 基本DOM事件
- 注册自定义DOM事件
- 事件代理
- $event对象



### 基本Dom事件 

__Syntax__

`on-click={Expression}`

与angularjs的处理方式类似， 每当事件触发时， 绑定的表达式Expression将会被运行一次， 



__Example__:

```html
<button on-click={count = count + 1}> count+1 </button> <b>{count}</b>,
```


每次你点击按钮， count都会增加1


[__&#x261E; DEMO__](http://jsfiddle.net/leeluolee/y8PHE)

__表达式的值如果===false, 事件将会被阻止__, 当然你也可以通过[$event.preventDefault()](#$event)来阻止事件.



<a name="custom-event"></a>

### 自定义DOM事件


__USEAGE__

`Component.event(event, fn)` 


你可以注册一些dom原生并不支持的事件，比如`on-tap`, `on-hold`

__注意regularjs遇到on-xx属性时， 会首先去检查是否注册了xx这个自定义事件__, 如果没有， 无论这个事件浏览器是否支持， 都会走简单DOM事件的流程。


__Arguments__

* event:  自定义事件名  (no `on-` prefix) 
* fn(elem, fire)
  - elem:    绑定节点
  - fire:    触发器 



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
  return function destroy(){ // return a destroy function
    dom.off(elem, "keypress", update);
  }
});

// use in template
<textarea on-enter={this.submit($event)}></textarea>`
```

由于模板的this指向组件本身， 所以这里相当于是当按了Enter后， 会运行组件submit方法.

查看 [$event](#$event)了解更多



###事件代理支持



所有的`on-*`都会在节点上绑定对应事件，在某种情况下(比如大列表)，这种方式不是很高效.

你可以使用`delegate-`来代理`on-` 来避免可能的性能问题. regularjs只会绑定唯一的事件到组件的第一父元素(无论你是如何$inject的)来处理组件内的所有代理事件




__Example__

```html
<div delegate-click="remove">Delte</div>   //Proxy way via delegate
<div delegate-click={this.remove()}>Delte</div> // Evaluated way via delagate
```


从用户使用角度讲，`on-`和`delegate-` 完全等价，但是各有利弊

1. 正如你在`jQuery.fn.delegate`中学到的，如果组件结构复杂，避免在那些高频触发的事件中使用事件代理(mouseover等)
2. 如果事件是[自定义事件](custom-event). 事件对象必须是可冒泡的，这样事件代理才能生效 ，你可以参考zepto's tap-event的[实现](https://github.com/madrobby/zepto/blob/master/src/event.jsL274).
3. 某些事件天生没法冒泡，比如ie低版下的chang。select等. 所以也就无法使用`delegate-`


总体来讲， 在动态模板里， 事件代理的唯一作用就是在超大列表里避免绑定过多的事件， 因为在常规的Web开发中，使用事件代理的最大优势其实是无需去关心事件的销毁和注册. 而在regularjs这种动态的模板框架中， `on-xx` 其实就已经具备这种能力, 监听和销毁都是自动完成的。

<a name="$event"></a>
### $event 对象


 那你可以使用`$event`来获取事件对象，这个变量会再每次事件触发时临时的定义在data.$event中， 即你可以在模板里直接使用它, 对于非自定义事件，则`$event`传入fire的对象.


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

[__&#x261E; DEMO__](http://jsfiddle.net/leeluolee/y8PHE/3/)


`$event`对象是被修正过的，在兼容IE6的前提下，你可以使用以下规范内的属性

0. origin:  绑定节点
1. target:  触发节点
2. preventDefault(): 阻止默认事件
3. stopPropagation(): 阻止事件冒泡
4. which
5. pageX
6. pageY
7. wheelDelta
8. event: 原始事件对象