# 动画系统

声明式动画绝对是所有MDV框架都面临的痛点，大部分框架都只处理了节点进入退出的场景。Regular的动画系统非常轻量级（代码量上），但是有很强大的实现，看看它的过人之处吧。

__本页方便起见依赖 [animate.css](https://daneden.github.io/animate.css/) 来实现CSS3动画效果__


## 动画简介


你可以通过`r-animation`指令来实现动画。


__Syntax__

```html

<div r-animation="Sequence"></div>

Sequence:
  Command (";"" Command)*

Command:
  CommandName ":"" Param;

CommandName: [-\w]+

Param: [^;]+

```


__Exmaple__

```html

  <button r-animation="
    on: click; 
    class: animated swing; 
    wait: 500; 
    class: animated fadeOut; ">点我动起来</button>

```

上例的意思是: 

1. 当 `click` 触发时
2. 为元素添加类名 `animated swing`，当 `transitionend` (或 `animationend`)触发时，移除它们
3. 等待 500ms.
4. 与第二步类似
6. 动画结束 done。(由于移除的添加的样式，节点会重新出现)

<script async src="//jsfiddle.net/leeluolee/fjyc4r9m/embed/result/"></script>


可以看到，一个单独节点的缓动序列是由一系列的 `Command` 构成的， 先看看内建的Command吧

## 内建Command


Regular 内建了多个Command，其中比较特殊的是 `on` 和 `when`，它们是唯二的用于激活动画开始的Command

### on: event

当特定的 event 触发时开始动画，__event可以是当前节点的DOM事件，也可以是所在组件的事件__。

> _注意: Regular会先去检查event是否是个DOM事件，如果不是，则会转而监听组件事件_

为实现渐入渐出效果，Regular 提供两个模拟事件

- enter: 在节点进入时触发
- leave: 在节点退出时触发 (动画结束后，节点才会被真正移除)

以下情况导致的节点进入退出会触发这两个事件

- [`r-hide`指令](../reference/directive.md#r-hide)
- [if语句](./statement/if.md)
- [list语句](./statement/list.md)
- [include语句](./statement/include.md)
- [component.$inject](../reference/api.md#inject)

__Example__

```html
<ul>
{#list items as item}
  <li class='animated' 
      r-animation='
        on:enter;
        class: fadeIn;
        on:leave;
        class: fadeOut'>{item.content}</li>
{/list}
</ul>

```

<script async src="//jsfiddle.net/leeluolee/xsenfrdq/embed/js,result/"></script>

### when: Expression

当表达式为真触发动画

```html

<div class='animated' r-animation='when: status===1; class: swing;'></div>

```

当`component.data.status`为1时，会触发此动画效果。



### class: classes, mode

class是基于CSS3的动画Command，它会等待动画结束之后(transitionend 或 animationend)，再执行后续效果。

__参数__

* classes: 空格分割的 className

* mode (Number): 添加 class 的模式

  `Command: class`的形为取决于 `mode`参数，一共有四种 mode.

  - 1: 默认 mode，首先加指定类名到节点，当动画结束移除它
  - 2: 首先添加 class 到节点，然后在 nextTick 添加`class-active`到节点用以触发动画，当动画结束移除所有类名
  - 3: 与 mode1 类似，但是动画结束后，我们不移除类名
  - 4: 移除指定类名，并等待动画结束。

__example__

```html
<div id="box1 animated" r-animation="on:click;class: fadeIn, 1">box1</div>
<div id="box2 animated" r-animation="on:click;class: fadeIn, 2">box2</div>
<div id="box3 animated" r-animation="on:click;class: fadeIn, 3">box3</div>
```

每当点击box1, box2 或 box3. 它们分别会产生不同的效果

__box1__:
  1. 添加 `animated fadeIn`
  2. 等待 `animationend` 移除它们

__box2__:
  1. 添加 `animated fadeIn`
  2. 添加 `animated-active fadeIn-active` at next-tick(to trigger the animation)
  3. 等待 `animationend` 然后移除所有 `animated fadeIn animated-active fadeIn-active`

__box3__:
  1. 添加 `animated fadeIn`
  2. 等待 `animationend`，动画结束


### emit: event

抛出某个事件，__注意这可能会触发另一个动画序列__（被命令 `on` 捕获）

```html

<div class='box animated' r-animation=
     "on: click; 
        class: swing ;
        emit: swing-over ;
        class: shake;
        emit: shake-over"
        >
  box1: trigger by click
</div>

<div class='box animated' r-animation=
     "on: swing-over; 
        class:  swing; 
      on:  shake-over; 
        class: shake;
      ">box2: after box1 swing</div>
```

box1 通过抛出 `swing-over` 事件触发了box2的动画。

<script async src="//jsfiddle.net/leeluolee/0cpL6rzy/embed/result/"></script>


### call: expression
  
运行一个表达式并进入脏检查，__注意，与emit类似，这里可能会触发另外一个动画序列__(被命令`when`捕获)

```html

<div class='box animated' r-animation=
     "when:test; 
        class: swing ;
        call: otherSwing=true ;
        class: shake">
  box1: trigger by checkbox
</div>
  
<div class='box animated' r-animation=
     "when: otherSwing; 
        class:  swing; 
      ">box2: after box1 swing</div>

```

__流程描述__

1. 当 `test == true` 激活box1的动画
2. swing动画结束之后，设置`otherSwing=true`
3. 这个导致box2的动画序列开始
4. box2 swing box1也在进行shake



### style: propertyName1 value1, propertyName1 value1 ...

设置样式并且等待 `transitionend`（如果可以触发的话）
  
__example__

```html
<div class='box animated' r-animation=
     "on: click; 
        class:  swing; 
        style: color #333;
        class: bounceOut;
        style: display none;
      ">style: click me </div>
```

添加 transition 来触发的缓动动画

```css
.box.animated{
   transition: color 1s linear;
}
```

这个例子的意思是: 

 - 一旦点击，swing动画。
 - 结束后设置`color:#333`(激活transition动画)... 
 - 步骤结束后，进行bounceOut动画。
 - 设置`display:none`
 - 动画序列结束

<script async src="//jsfiddle.net/leeluolee/pn2jufby/embed/result/"></script>







### wait: duration

等待若干毫秒后再进入下一个步骤

__param__

- duration: 一个毫秒为单位的整数。

```html
<div class='box animated' r-animation=
     "on:click; 
        class: swing ;
        wait: 2000 ;
        class: shake">
  wait: click me
</div>


```

<script async src="//jsfiddle.net/leeluolee/9vhdgw48/embed/result/"></script>





## 扩展动画{#animation}

上例基本都依赖CSS3的动画，如果需要更精细的动画控制，或是需要兼容不支持CSS3的浏览器，可以通过`Component.animation接口`扩展你的动画Command（上述所有Command都基于此接口实现）

__参数__

- name(String): 命令名
- handle(step): 序列命令定义，你需要在handle中返回一个函数
  - step.element: 即上述element对象
  - step.param: 即上述param
  - 返回值[Function]: handle函数必须返回一个动画处理函数，它接受一个参数`done`用来结束当前动画。

__Example__

实现一个渐入渐出的效果

```javascript
Regular.animation("fade", function(step){
  var param = step.param, // 传入fade的参数
    element = step.element, //触发节点
    fadein = param === "in",
    ratio = fadein?  1.05: 0.9;

  // 这个函数会在每次本步骤被触发时被调用，
  // 它只接受一个done函数作为参数，标志着本步骤的结束
  return function(done){ 
    var start = fadein?  0.01: 1;
    var tid = setInterval(function(){
      start *= ratio 
      if(fadein && 1- start < 1e-3){
        start = 1; 
        clearInterval(tid);
        done()
      }else if(!fadein && start < 1e-3){
        start = 0;
        clearInterval(tid);
        done()
      }
      element.style.opacity = start;
    }, 1000 / 60) 
  }
})
```

使用

```html
<div class='box animated' r-animation=
       "on:click; 
        class: swing ;
        fade: out ;
        fade: in;
         ">
    fade: click me
</div>

```

⚠️当你定义的动画结束时，必须调用这个done函数，__否则永远进入不了下一个动画步骤__


<script async src="//jsfiddle.net/leeluolee/xLpa62zr/embed/result/"></script>


查看内建命令[(github:animation.js#L71)](https://github.com/regularjs/regular/blob/master/lib/directive/animation.js#L71)的实现来理解扩展动画 Command


> 小贴士: 其实`r-animation` 不仅仅限于应用动画，它其实是个支持声明式表述的状态机，你可以利用它来实现一些异步序列。



## 跨节点的复杂动画序列

> 这是一个显示肌肉但不被推荐在真实场景使用的例子

可能相对于其他声明式的框架，Regular 的动画声明的写法上会繁琐一些，但是带来了无限的可能性，结合数据监听体系和事件系统，事实上你可以在 Regular 中实现任意复杂度，跨越任意节点的动画序列！


__Example__

<script async src="//jsfiddle.net/leeluolee/L5faxjbh/embed/js,result/"></script>


## 小节

由于声明式动画的天然限制，不要奢求其对动画的控制力可以达到手动JS编码的自由度(比如使用velocity.js)。如果有难以实现且不可复用的场景，直接操作DOM来完成吧。

> 建议优先使用事件来完成动画序列的串联。
