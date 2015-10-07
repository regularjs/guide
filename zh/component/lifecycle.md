
# 组件生命周期

这一章节， 我们来看下在组件的生命周期来帮助我们理解 Regular内部的运行机制. 

<a name="new"></a>
## 当`new Component(options)` ...

> 注意使用内嵌的方式初始化， 仍然是一样的初始化流程

当你实例化组件时，将会发生以下剧情

_对应的源码来源于[src/Regular.js](https://github.com/regularjs/regular/blob/master/src/Regular.jsL31)_

#### 1 [options]({{api}}#api-reference-静态接口-options)将合并原型中的[events](events), data 

```js
options = options || {};
options.data = options.data || {};
options.events = options.events || {};
if(this.data) _.extend(options.data, this.data);
if(this.events) _.extend(options.events, this.events);

```


#### 2 将options合并到this中


```js
_.extend(this, options, true);
```

<b>&#x26A0;</b> __实例化中传入的属性会覆盖原型属性__


#### 3  解析模板

如果模板本身已经被解析过了(AST)，这步跳过.

```js
if(typeof template === 'string') this.template = new Parser(template).parse();
```

#### 4. 根据传入的options.events 注册事件

传入预定义的事件, 通过`events`属性进行注册与config中注册带来的效果是一致的.

```js
if(this.events){
  this.$on(this.events);
}
```


注意: 一般很少会使用events对象来配置事件绑定，而更偏向在`init`或`config`阶段配置, 不过当你使用implement时，可以通过这种方式在组件生命周期里切入你的业务逻辑， 例如:

```js

var EmitterMixin = {
  events: {
    $config: function(){  // 切入config阶段
      this.__listeners = {};
    }
  },
  on: function(event, listener){
    var listeners = this._listenters;
    // add listener to listeners
  },
  off: function(){ },
  emit: function(){ }
}

Component.implement(EmitterMixin)

```

可以达到和继承一样的效果， 但是少了一次继承关系. 对于Emitter这样独立的功能， 显然Mixin更加合理.

> Regular已经内置了一个Emitter，这里仅作为例子


#### 5* __触发`$config`事件, 调用config函数.__

config意为配置, 一般此函数用于预先处理组件状态，以得到预期的首次compile结果

```js
this.$emit('config');
this.config && this.config(this.data);
```

> 请铭记: 与__init__的区别是, 此阶段在compile之前.

#### 6* __编译模板__, 触发一次组件脏检查

这里的脏检查是为了确保组件视图正确,　__到这里我们已经拥有初始化的dom元素__, 你可以通过$refs来获取你标记的.

```js

if(template){
  this.group = this.$compile(this.template, {namespace: options.namespace});
}

```

> 请知晓: compile 之后， 标志着组件有了初始结构

#### 7* __触发`$init`事件，并调用this.init方法. __

调用init之后我们不会进行自动的脏检查.

```js
this.$emit("$init");
if( this.init ) this.init(this.data);
```

> 请铭记， 与__config__的区别是， 此阶段在compile之后, 意味着你可以通过[$refs]({{api}}#refs})获取到你标记的dom结构.

------

<a name="destroy"></a>
## 当 `component.destory()` ...

当销毁组件时，剧情就要简单的多了.

1. 触发`$destroy`事件

2. 销毁所有模板的dom节点,并且解除所有数据绑定、指令等

需要注意的是，是Regular.prototype.destory完成了这些处理,　所以永远记得在你定义的destory函数中使用`this.supr()`. 一个更稳妥的方案是: 永远不重写destroy, 而是注册`$destory`事件来完成你的回收工作.

```js
Component.extend({
  init: function(){
    this.$on('$destory', function(){

      // destroy logic

    })
  } 
})
```




<a href="#" id="composite"></a>

## 当遇到`<customer-pager/>`这样的标签时...


在编译阶段(AST -> DOM)，每当Regular碰到一个节点标签例如
(其中，我们假定__`custom-pager`__是一个已注册的组件)


- `<custom-pager attr1={user} attr2=user on-nav={this.nav()}></custom-pager>` 
- `<div class="text" r-hide={!text}></div>`



将会发生以下过程

- 查找是否可以找到注册为对应名字的组件(通过`Component.component`)
- 如果找到,　则视其为内嵌组件(如`custom-pager`),　会执行流程1
  1. 创建一个空对象`data`.
  2. 如果有[内嵌内容](component/composite.md), 它会被解析并作为实例的`$body`属性, 你可以配合 `{#include this.$body}` 来使用它, 也可以将其结合include使用(注意，两种方式的作用域指向是不同的)
  3. 遍历每个属性，
    - 如果不是事件则作为`data`的一个属性值,　如果为插值则建立父组件与子组件的__双向绑定__
    - 如果是[`ref`](component/ref.md)则标记它
    - 如果是事件名`on-xx`,则注册为Emitter事件,相当于`this.$on(xx, ...)`
  4. 初始化组件(通过new Component), `data`会作为参数传入
  5. 插入到父组件的内容中
- 如果没有找对应组件名 ,则执行流程2
  1. 创建一个节点`document.createElement(tagName)`
  2. 编译它的子元素(如果有的话)，并塞入节点.
  3. 遍历属性值, 分别根据指令,事件和普通属性值处理, 与组件一样， 如果是[`ref`](component/ref.md),则会标记这个节点.
  4. 将节点插入到父组件的内容中

流程1即我们所说的内嵌组件. 注意内嵌组件无法使用指令, 因为它并不是一个真实节点，而是一种抽象.


- __Example__

  
  __external__组件的模板中声明
  

  ```html
  <pager current={current} total=100 
    on-nav={this.hello()} 
    on-end='end' />
  ```

  
  就相当于是手动调用组件(参数请查看[API:options](?api-zh#options))
  

  ```js
  
  var pager = new Pager({
    events: {
      nav : function(){
        extenal.hello();
      },
      end: function(){
        extenal.$emit('end');
      }
    },
    data:{
      total: "100"
    }
  })
  pager.$bind(extenal, 'current');
  ```

  
  其中extenal代表嵌入它的外层组件. 
  


[【DEMO】](http://jsfiddle.net/leeluolee/DCFXn/)


where
  
  - template in `#external`
    
```html
{list.length}:{current}
 <pager total={Math.floor(list.length/20)} 
        current={current} 
        on-nav={this.changePage($event)}/>

 <pager total={Math.floor(list.length/20)} 
        current={current} 
        on-nav='nav' />
```



<!--

## 当内嵌组件之间有组合关系时.

在上面[组件组合章节](composite.md)的介绍中， 我们了解到了，在内层组件中，我们可以通过`this.$outer`获得它「视觉上」上的父节点. 例如

```html

// ... 略...

var App = Regular.extend({
  template: `
    <tab>
      <tab.pane></tab.pane>
      <tab.pane></tab.pane>
      <tab.pane></tab.pane>
    </tab>
  `
})

var app = new App().$inject('body');

```

_标签名无须care, 这只是个人的一种命名习惯_


```js

var TabPane = Regular.extend({
  name:'tab.pane',
  config: function(data){
    if(this.data.selected) {
      this.$outer.pick(this);
    } 
  }
})



```

所以，我们可以得知，在`TabPane`的config时，我们已经可以获得`Visual Parent`(视觉父节点`tab`)的实例. 现在我们比[『小节: 当 new Component 发生时...』](#new)更进一步来分析下， 组合发生时的完整流程， 我们还是以上面的`tab`和`tab.pane`为例.


```shell

app config -> app compile 
                  \
                  tab config -> tab compile(由于内部的 #include this.data.selected.$body)
                                      \ 
                                      tab.pane config -> tab.pane compile -> tab.pane init
                                      /
                                tab init
                                  /


                                          

```




-->