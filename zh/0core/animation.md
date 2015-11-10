# 动画

regularjs 提供了纯声明式的动画支持，看完本章指南你会发现regularjs的动画系统的灵活和强大，它甚至可以完美的控制动画队列。

你可以通过`r-animation`指令来

you can using multiply animation via single directive: `r-animation`

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

<div r=animation="on: click; class: animated fadeIn; wait: 1000; class: animated fadeOut; style: display none; "></div>

```


 上例的意思是: 

1. when `click` triggered
2. addclass `animated fadeIn` to element, when `transitionend` (or `animationend`), remove the class.
3. waiting 1000ms.
4. similar with step 2.
5. addStyle `display:none` to element,( if trigger `transition`, this command will waitting for `transitionend`)
6. animation done.


## 内建Command


### 1. on: event

当特定的event is trigger(ui事件)，开始动画

### 2. when: Expression

当表达式为真触发动画


> on 和 when 是目前仅有的触发动画序列的Command


### 3. class: classes, mode



__参数__

* classes: 空格分割的className
* mode (Number): 添加class的模式

   `Command: class`的形为取决于 `mode`参数，一共有三种mode.
  - 1: 默认mode，首先加指定类名到节点，当动画结束移除它
  - 2: 首先添加class到节点，然后在nextTick添加class-active到节点用以触发动画，当动画结束移除所有类名，这个模式与angular类似。
  - 3: 与mode1类似，但是动画结束后，我们不移除类名

__example__

```html
<div id="box1" r-animation="on:click;class: animated fadeIn, 1">box1</div>
<div id="box2" r-animation="on:click;class: animated fadeIn, 2">box2</div>
<div id="box3" r-animation="on:click;class: animated fadeIn, 3">box3</div>
```

__box1__:
  1. add `animated fadeIn`
  2. when `animationend` remove them

__box2__:
  1. add `animated fadeIn`
  2. add `animated-active fadeIn-active` at next event-loop(to trigger the animation)
  3. when `animationend` then remove all of `animated fadeIn animated-active fadeIn-active`

__box2__:
  1. add `animated fadeIn`
  2. when `animationend` , do nothing



### 4. call: Expression
  
运行一个表达式并进入digest phase，注意这里由于可能会触发本节点或其它节点的`when`条件，所以可以用来控制动画序列。

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

1. when `test` is computed to true, start box1's animation
2. swing then call `otherSwing = true`;
3. box2's `otherSwing` is evaluted to `true`. 
4. box2 shakes, meanwhile box1 shakes;
5. done.

> <a href="http://codepen.io/leeluolee/pen/aHwoh/"><span class="icon-arrow-right"> <strong>Result on Codepen</span></strong></a>






### 5. style: propertyName1 value1, propertyName1 value1 ...

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

 - once clicking, swing it.  
 - then set `style.color=#333`(trigger transition)... 
 - 动画结束




### 6. wait: duration

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






<!--  -->

<a name="animation"></a>

## 扩展 Animation

你可以通过`Component.animation(name, handle)`扩展你的动画Command(内部Command也是通过此接口扩展)


__参数__

- name (String): 命令名
- handle(step): 序列命令定义，你需要在handle中返回一个函数
    - step: step携带着你用来定义动画的信息


例如，我们要实现一个渐入渐出的效果

```javascript
Regular.animation("fade", function(step){
  var param = step.param, // 传入fade的参数
    element = step.element, //触发节点
    fadein = param === "in",
    step = fadein?  1.05: 0.9;

  // 这个函数会在每次本步骤被触发时被调用，
  // 它只接受一个done函数作为参数，标志着本步骤的结束
  return function(done){ 
    var start = fadein?  0.01: 1;
    var tid = setInterval(function(){
      start *= step 
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

所有你需要做的是，当动画结束时，调用这个done函数。


> <a href="http://codepen.io/leeluolee/pen/qJvry/"><span class="icon-arrow-right"> <strong>Result on Codepen</span></strong></a>




你也可以查看其它内建命令的实现[github](https://github.com/regularjs/regular/blob/master/src/directive/animation.js#L71。真的很简单。

----------------------




