# 动画系统

声明式的动画绝对是所有MVVM框架都面临的难点，90%的框架都只处理了 节点进入退出的动画操作。Regular的动画系统非常轻量级(代码量上)，但是毫无疑问的是很强大的实现，眼见为实，看看它的过人之处吧。


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

<div r=animation="on: click; class: animated fadeIn; wait: 1000; class: animated fadeOut; "></div>

```

上例的意思是: 

1. 当 `click` 触发时
2. 为元素添加类名 `animated fadeIn`，当 `transitionend` (或 `animationend`)时，移除它们
3. 等待 1000ms.
4. 与第二步类似
6. 动画结束 done.



## 内建Command


动画系统中内建了多个Command，其中比较特殊的是 `on` 和 `when`，它们是唯二的两个用于激活动画开始的Command

### 1. on: event

当特定的event 触发时，开始动画，event可以是当前节点的DOM事件，也可以是所在组件的事件。

_注意: Regular会先去检查event是否是个DOM事件，如果不是，则会转而监听组件事件_

Regular提供了两个模拟事件来模拟节点的进入退出效果。

- enter: 在节点进入时触发
- leave: 在节点退出时触发 (动画结束后，节点才会被真正移除)

目前`r-hide`指令，`{#if}` 和 `{#list}` 以及 `{#include}` 或是`component.$inject`等导致的节点变化，都会触发 'enter' 和 'leave' 效果。

__Example__

```html
<ul>
{#list items as item}
  <li class='animated' r-animation='on:enter;class: fadeIn;on:leave;class: fadeOut'>{item.content}</li>
{/list}
</ul>


```


### 2. when: Expression

当表达式为真触发动画

```html

<div class='animated' r-animation='when: status===1; class: swing;'></div>

```

当`component.data.status`为1时，会触发此动画效果。




### 3. class: classes, mode

class是基于CSS3的动画Command，它会等待动画结束之后(transitionend 或 animationend)，再执行后续效果。

__参数__

* classes: 空格分割的className
* mode (Number): 添加class的模式

   `Command: class`的形为取决于 `mode`参数，一共有三种mode.
  - 1: 默认mode，首先加指定类名到节点，当动画结束移除它
  - 2: 首先添加class到节点，然后在nextTick添加class-active到节点用以触发动画，当动画结束移除所有类名，这个模式与angular类似。
  - 3: 与mode1类似，但是动画结束后，我们不移除类名
  - 4: 移除指定类名，并等待动画结束。

__example__

```html
<div id="box1" r-animation="on:click;class: animated fadeIn, 1">box1</div>
<div id="box2" r-animation="on:click;class: animated fadeIn, 2">box2</div>
<div id="box3" r-animation="on:click;class: animated fadeIn, 3">box3</div>
```

每当点击box1, box2 或box3. 它们分别会产生不同的效果

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


### 4. emit: event

抛出某个事件，__注意这可能会触发另一个动画序列__( 被命令`on` 捕获)

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

box1 通过抛出swing-over等事件触发了box2得动画。

[DEMO on codepen](http://codepen.io/leeluolee/pen/jEzPgd)

### 5. call: expression
  
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

流程如下:

1. 当 `test == true` 激活box1的动画
2. swing动画结束之后，设置`otherSwing=true`
3. 这个导致box2的动画序列开始
4. box2 swing box1也在进行shake

> <a href="http://codepen.io/leeluolee/pen/aHwoh/"><span class="icon-arrow-right"> <strong>Result on Codepen</span></strong></a>



### 6. style: propertyName1 value1, propertyName1 value1 ...

设置样式并且等待 `transitionend`(如果可以触发的话)
  
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

你需要添加transition样式来触发style的动画

```css
.box.animated{
   transition:  color 1s linear;
}
```

这个例子的意思是: 

 - 一旦点击，swing动画。
 - 结束后设置`style.color=#333`(激活另外transition)... 
 - 步骤结束后，进行bounceOut动画。
 - 动画序列结束




### 7. wait: duration

等待数秒再进入下一个步骤

__param__

- duration: an integer indicating the number of milliseconds to delay execution of the next animation in the queue. 

```html
<div class='box animated' r-animation=
     "on:click; 
        class: swing ;
        wait: 2000 ;
        class: shake">
  wait: click me
</div>


```

> <a href="http://codepen.io/leeluolee/pen/FhwGC/"><span class="icon-arrow-right"> <strong>Result on Codepen</span></strong></a>






<a name="animation"></a>

## 扩展 Animation

上面的所有例子，其实都是基于CSS3的动画，如果你需要更精细的动画控制，或是需要兼容不支持CSS3的浏览器，那可能需要通过`Component.animation接口`扩展你的动画Command(内部Command也是通过此接口扩展)


__参数__

- name (String): 命令名
- handle(step): 序列命令定义，你需要在handle中返回一个函数
  - step.element: 即上述element对象
  - step.param: 即上述param
  - 返回值[Function]: handle函数必须返回一个动画处理函数，它接受一个参数`done`用来结束当前动画。

> 0.4.1将参数展开是为了与event和directive接口参数做统一。

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

你必须记住的是，当你定义的动画结束时，调用这个done函数。


> <a href="http://codepen.io/leeluolee/pen/qJvry/"><span class="icon-arrow-right"> <strong>Result on Codepen</span></strong></a>


你也可以查看内建命令的实现[(github链接)](https://github.com/regularjs/regular/blob/master/src/directive/animation.js#L71)来理解这个用法


> 小贴士: 其实`r-animation` 不仅仅限于应用动画，它其实是个支持声明式表述的状态机，你可以利用它来实现一些异步序列。



## 再来一个不被推荐的例子

可能相对于其他声明式的框架，regularjs的动画声明的写法上会繁琐一些，但是带来了无限的可能性，结合数据监听体系和事件系统，事实上你可以在regularjs中实现任意复杂度，跨越任意节点的动画序列!

[【DEMO: 实现一个无限循环的animation】](http://codepen.io/leeluolee/pen/vrgqu) 


## 小节

不过由于声明式动画的天然限制，永远不要奢求其对动画的控制力可以达到手动js编码的自由度(比如使用velocity.js).

你可以通过在组件init后，手动通过[`$refs`](../component/ref.md)获取节点并结合velocity.js等更专业的动画框架来实现你需要的动画效果。

注意动画使用不当是可能与组件本身的数据-UI状态产生冲突，
所以一般来讲，应该尽量使用on/emit的组合，而少使用when/call的组合来实现动画序列 

