

# 组合

_请升级到版本`0.4.0`以上，这个版本已将`<r-content/>`统一到了 `{#include}`中。_ 

组合(Composite)是组件的一种设计思路。

在《前端圈-走进网易》的分享会中，我在[漫谈前端组件](http://leeluolee.github.io/fequan-netease/#/63) 这个Topic中介绍到了组件的组合概念，如果一个组件型框架不支持『组合』，那我们可以称这个组件框架是功能不完整的。

本章内容会涉及三部分内容

- [内嵌内容](#body)，即`this.$body`
- [引入声明](#include)，即`{#include}`
- [视觉父节点(Visual Parent)](#outer)，即`this.$outer`

> 如果说「组件」是Regular的核心，那「组合」就是Regular核心中的核心

<a name="body"></a>


## 内嵌内容（transcluded content）

### 『什么是内嵌内容?』


内嵌内容即被当前节点包裹的内容，例如我们日常书写的html

```html
<ul>
  <li>One</li>
  <li>Two</li>
</ul>

```

`<ul>`的内嵌内容就是它的childNodes，即

```html
  <li>One</li>
  <li>Two</li>
```

在上面的例子中，我们很容易的可以理解到`<li>`和`<ul>`是有__『结构上』__明显的父子关系的，这是一种最常见的组合关系。

我们可以再来看看另一个例子`video`标签。

```html
<video src="dest/a.mp4"></video>

```
其实还有另外一种定义方式

```html
<video src="">
  <source>
  <source>
</video>

```

这种其实更接近一种__『内容上』__的组合关系，`video`会使用到`source`节点的信息。事实上audio标签也可以直接嵌套`source`，所以它们就是一种组合关系。

对于组件而言，内嵌内容也是类似，即__被组件标签所包裹的内容__。

```html
<modal on-confirm={this.ok()}>
  <p>Please input your password!!</p>
</modal>
```

其中`<p>Please input your password!!</p>`即为组件modal的内嵌内容，

在Regular中，内嵌内容会成为组件的`$body`属性，你可以通过`this.$body` 来得到它。

但问题问题来了，__『如何使用内嵌内容this.$body? 』__

<a name="include"></a>

## 使用内嵌内容。

现在我们基于一个小例子来看下在Regularjs中，怎么使用组合来设计组件

例如Bootstrap的alert组件。

代码如下

```html 
<div class="alert alert-warning alert-dismissible fade in" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    <span class="sr-only">Close</span>
  </button>
  Holy guacamole! You should check in on some of those fields below.
</div>
```

我们会发现，所以很自然的，我们会将组件封装成这个样子

```html

<alert 
  type='warn' 
  content={message} 
  on-close={this.closeAlert($event)}>

</alert>

```

`content` 即我们要传入的提示信息，组件也暴露了一个close事件用来告诉组件调用者。

对应组件的模板如下

```html
<div class="alert alert-warning alert-dismissible fade {show? 'in':''}" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true" on-click={this.close()} >&times;</span>
    <span class="sr-only">Close</span>
  </button> 
  {content}
</div>
```

通过`content` 我们可以自定义要显示的alert信息。但这时是没法传入html结构的，所以我们修改为通过`{#include}`来传入模板片段，插值部分修改如下

```html
{#include content}
```

然而include模板字符串仍然有不足之处，即传入的content模板其实context是指向Alert组件的，比如

```js
var App = Regular.extend({
  template: "<alert content={content}></alert>"
  data: {
    content: 'Holy guacamole! You should check in on some of those fields below.<button on-click={this.close}>close</button>'
  },
  closeAlert: function(){
    
  }
})
```

此时，你会有受挫感，因为其实content对应这段模板的context是属于Alert组件的，而不是我们的APP，进而也就没法调用到APP实例上的closeAlert了。

__最终解决方案：通过`{#include this.$body}`使用内嵌内容__

```js
var Alert = Regular.extend({ 
  name: 'alert',
  // ignore other 
})

var app = new Regular({
  template: 
    '<alert show={showAlert}>\
       <strong>Holy guacamole!</strong> You should check in on some of those fields below.\
      <button class="btn btn-default" on-click={showAlert=false}>close</button>\
    </alert>',
  data: {
   showAlert: true
  }
}).$inject('#app');
```

这里`alert`包裹的部分就是`this.$body`所代表的区域。

对于上层组件app而言，alert节点本省就像个容器，它内部的`this.$body` 的内嵌内容的Context仍然属于App本身，所以我们可以通过showAlert来直接控制app的showAlert。

[|DEMO|](http://codepen.io/leeluolee/pen/ojdegY)


## 关于`this.$body`

### 神秘的`$body`到底是什么

好奇性强的同学可能已经发现了，当存在内嵌内容时，`this.$body`实际上是一个函数。运行它相当于对『内嵌的模板』进行了一次编译动作并返回一个『块(Group)』，「块」类似于一个阉割版的组件，也可以被插入到某个位置，比如`this.$body().$inject(element)` , `#include 声明`事实上也是这么使用它的。

__当然永远不要这样去使用`this.$body`__，这相当于一个课外知识，你只需要配合`#include`使用即可。

### 手动传入`$body`属性

在上面的例子中，我们可以很方便的通过在组件节点之间插入内容来自定义组件需要的某些模板片断，但这会引入一个问题，

__『当我们使用JS初始化组件时，如何定义内嵌内容？』__。你可以采用手动传入的方式

```js

var alert = new Alert({
  $body: "<a href='#' on-click={this.click()}>hello</a>"
})

```

此时`this.$body`是一个字符串。运行之后你会发现也可以凑效，这个是由于[{#include}]({{syntax}}#include)的特性决定的：

__『include同时也接受字符串作为参数』__

但是此时`$body`内容的this对象指向`alert`组件本身，因为它现在只是一次常规的include引入。

<a name="outer"></a>

## 视觉父节点(Visual Parent): `this.$outer` 


为了完善组合这个功能，Regular同时引入 __视觉父节点__ 这个概念。首先我们以一个简单的tab组件的使用为例来说明：

```js
 <tab>
  <tab.pane title='tab1'>
    USER: <input class='form-control'  r-model={user} >

  </tab.pane>
  <tab.pane title='tab2' selected on-active={this.select()} >
    <h2>Hi, {user}</h2>
    <i>You can pass any html in here</i>
  </tab.pane>
</tab>
```

对应的`tab`以及`tab.pane`的实现如下(方便起见，使用了[ES6的语法来帮助我们管理模板字符串](../practicle/template.md))

```html
// Tab组件
const Tab = Regular.extend({
  name: 'tab',
  template: `
    <ul class="nav nav-tabs">
       {#inc this.$body}
    </ul>
    <div class='tab-content' r-anim='on:switch;class:fade in'>
      {#inc selected.$body}
    </div>
  `
})

// Tab的Pane配套子组件
Tab.Pane = Regular.extend({
  name: 'tab.pane',
  template: `
  <li role="presentation" 
    class={this.$outer.data.selected==this? 'active':''} 
    on-click={this.pick()}>
    <a href={href || 'javascript:;'}>{#inc title}</a>
  </li>
  `,
  config: function(data){

    if(data.selected) this.pick();

  },
  pick: function(){

    if(!this.$outer) return;
    this.$outer.$update('selected', this);
    this.$emit('active', this);

  }
})

return Tab;

```

>_关于tab.pane的命名只是为了表明这个组件仅仅只是tab的配套组件，并无其他限制，你也可以使用别的命名方式_

我们发现在`tab.pane`组件内，我们可以通过`this.$outer`这个特殊属性来获得包裹它的组件`tab。我们称『`<tab></tab>`是`<tab.pane></tab.pane>`的视觉父节点』。而本质上，它们同属于`application`这个组件的内嵌组件。

[__DEMO__](http://codepen.io/leeluolee/pen/EVLvRN)

利用`this.$outer`这个属性，我们可以实现视觉父子组件之间的逻辑信息传递，它与`this.$body`可以创造出很多组件组合的实现方式。


## 组合本身带来的意义

事实上继承(extend)或是混入(implement)，已经可以解决Regular组件的成员属性和方法的复用问题，但是对于UI组件本身的模板却无法做到复用，通常如果组件结构变化了，那整个组件的模板都将重写。所以组合其实是一种组件设计思想：

> 『组合会强迫你将组件变化的部分提取出来通过#include引入，从而不变的部分可以得以复用』

就比如我们上例的Alert的内容部分。

## 小节

组合(composite)是个非常强大的功能，而且在Regular中，内嵌内容的概念已经整合得足够简单和灵活，`{#include}`这也是Regular与其它许许多多的`web component`变体解决方案的本质差别。

并且这种方式定义，我们从直觉上很容易将内嵌内容和『其视觉父节点』进行关联，并且也符合我们对于html的原本理解。


