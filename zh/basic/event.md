# 事件

在Web开发领域，行为通常由事件发起，它的重要性不言而喻。Regular中，事件分为两类

- DOM事件
- 组件事件 

在模板中，它们使用方式相似，表现也一致。但在某些方面，也有些微妙区别，让我们深入的了解下它们吧

##  DOM 事件

所有__节点上__的`on-`开头的属性都会被作为DOM事件处理 

tip: 由于`Component.directive`支持正则匹配属性名，所以内部实现中DOM事件其实是一种特殊的指令，它以`/on-\w+/`作为指令名，从而匹配出以on-开头的作为事件处理。

这小节的内容主要包括

- 基本DOM事件
- 注册自定义DOM事件
- 事件代理
- $event对象


#### 基本DOM事件 

__Syntax__

`on-click={Expression}`

每当事件触发时，绑定的表达式Expression将会被运行一次，


__Example__:

```html
<button on-click={count = count + 1}> count+1 </button> <b>{count}</b>,
```


每次你点击按钮，count都会增加1


[__&#x261E; DEMO__](http://jsfiddle.net/leeluolee/y8PHE)

> __表达式的值如果===false，事件将会被阻止__，当然你也可以通过[$event.preventDefault()](#$event)来阻止事件。



<a name="custom-event"></a>

#### 自定义DOM事件

__Usage__

`Component.event(event, fn)` 


你可以注册一些dom原生并不支持的事件，比如`on-tap`, `on-hold`

__注意regularjs遇到on-xx属性时，会首先去检查是否注册了xx这个自定义事件__，如果没有，无论这个事件浏览器是否支持，都会走简单DOM事件的流/程 (即都会通过addEventListener来绑定事件) 


__Arguments__

* event:  自定义事件名 (没有`on-`前缀) 
* fn(elem, fire)
  - elem:    绑定节点
  - fire:    触发器 



注意如果需要做 __销毁工作__，与指令一样，你需要返回一个销毁函数



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

由于模板的this指向组件本身，所以这里相当于是当按了Enter后，会运行组件submit方法。

查看 [$event](#$event)了解更多



####事件代理支持



所有的`on-*`都会在节点上绑定对应事件，在某种情况下(比如大列表)，这种方式不是很高效。

你可以使用`delegate-`来代理`on-` 来避免可能的性能问题。regularjs只会绑定唯一的事件到组件的第一父元素(无论你是如何$inject的)来处理组件内的所有代理事件




__Example__

```html
<div delegate-click="remove">Delte</div>   //Proxy way via delegate
<div delegate-click={this.remove()}>Delte</div> // Evaluated way via delagate
```


从用户使用角度讲，`on-`和`delegate-` 完全等价，但是各有利弊

1. 正如你在`jQuery.fn.delegate`中学到的，如果组件结构复杂，避免在那些高频触发的事件中使用事件代理(mouseover等)
2. 如果事件是[自定义事件](custom-event。事件对象必须是可冒泡的，这样事件代理才能生效，你可以参考zepto's tap-event的[实现](https://github.com/madrobby/zepto/blob/master/src/event.jsL274).
3. 某些事件天生没法冒泡，比如ie低版下的chang。select等。所以也就无法使用`delegate-`


总体来讲，在动态模板里，事件代理的唯一作用就是在超大列表里避免绑定过多的事件，因为在常规的Web开发中，使用事件代理的最大优势其实是无需去关心事件的销毁和注册。而在regularjs这种动态的模板框架中，`on-xx` 其实就已经具备这种能力，监听和销毁都是自动完成的。

<a name="$event"></a>
### $event 对象


 那你可以使用`$event`来获取事件对象，这个变量会再每次事件触发时临时的定义在data.$event中，即你可以在模板里直接使用它，对于非自定义事件，则`$event`传入fire的对象。


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

[__&#x261E; DEMO__](http://jsfiddle.net/leeluolee/y8PHE/10/)


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

## 组件事件

Regularjs集成了一个轻量级的Emitter，使得所有组件都可以使用以下接口来实现事件驱动的开发

- [component.$on]({{ref}}?api-zh#on): 用于添加事件监听器
- [component.$off]({{ref}}?api-zh#off): 用于解绑事件监听器
- [component.$emit]({{ref}}?api-zh#emit): 用于触发某个事件




### 模板里声明组件事件绑定

当组件以内嵌组件的方式初始化时，它的事件的绑定方式与DOM事件非常类似，即

__所有__组件上__的`on-`开头的属性都会被作为组件事件绑定处理__(其它属性会作为data的属性传入)

假设已经注册了一个名为`pager`的翻页器组件

```html
<div>
    <pager on-nav={ this.refresh($event) }></pager>
</div>
```

这个例子的意思是，每当作为内嵌组件的modal抛出`confirm`事件(通过[$emit('confirm')]({{ref}}?api-zh#emit))，外层组件会运行refresh方法。

是的，和DOM事件并无二样。但其中`$event`代表$emit传入的__第一个__参数


[__&#x261E; DEMO__](http://jsfiddle.net/leeluolee/y8PHE/3/)


### 内建生命周期内的组件事件

regularjs会在初始化时的关键阶段抛出事件

1. $config: 会在compile之前触发，你可以在此时预处理组件数据
2. $init : 会在compile之后触发，此时，dom结构已经生成，你可以通过ref来获取了
3. $destroy: 会在组件被destroy时，触发

`$`前缀是为了区分这个是个内建的事件。

下一节，我们会学习下DOM事件与组件事件的相同点与不同点。




## 事件的共性

无论是组件事件还是DOM事件，它们都具有一些共性

### 回调方式取决于你传入的属性值

取决于你传入的值是表达式插值还是普通属性，regularjs会做不同的响应处理，例如

- 表达式(e.g. `on-click={this.remove()}`)
  
  如果传入的是表达式，与angular类似，一旦事件触发，此表达式会被运行一次。
  
  __Example__
  ```html
    <div on-click={this.remove(index)}>Delte</div>
  ```

   在你的组件中定义remove逻辑

  ```javascript
  var Component = Regular.extend({
    template:'example',
    remove: function(index){
      this.data.list.splice(index ,1);
      // other logic
    }
  })

  ```

  
  一般来讲推荐这种方式来处理事件。
  


-  非表达式(e.g. `on-click="remove"`)

  当传入的不是表达式，事件会被代理到组件的事件系统中，你可以使用`$on`去处理此事件
  
  __Example__

  ```html
    <div on-click="remove">Delte</div>
  ```

   然后利用`$on`方法来处理事件

  ```javascript
  var Component = Regular.extend({
    template:'example',
    init: function(){
      this.$on("remove", function($event){
          // your logic here
      })
    }
  })

  ```

### 当然它们也有所不同

1. 组件事件是由`$emit`方法抛出，而DOM由用户触发，由浏览器抛出(除了自定义事件)
2. dom事件由于DOM本身的特点是可以冒泡的，但是组件事件没有冒泡这一机制。
3. `$event`在组件事件中是$emit传入的第一个参数，而DOM事件中是封装过的事件对象


## 结尾

我们看到，DOM事件和组件事件非常相似，事实上它们在内部也是公用一套流程，有兴趣的可以去看看源码。