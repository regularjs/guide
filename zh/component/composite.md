
# 组合


_请升级到版本`0.4.0`以上, 这个版本已将`<r-content/>`统一到了 `{#include}`中._ 

使用Regular通常会经历三个阶段

- 当高级版的模板使用
- 提取公用逻辑抽象成组件(内嵌组件)
- 使用__组合的组件__

这个章节就是帮助你理解组件的组合是怎么回事, 由于在模板原理上与Angular是南辕北辙， 你会发现Regular的组合会更接近React一些.  




__组合即使用在组件内使用到内嵌内容__, 所以本章内容会涉及两部分内容

- [内嵌内容](#body), 即`this.$body`
- [引入声明](#include), 即`{#include}`
- [视觉父节点(Visual Parent)](#outer)

> 如果说「组件」是Regular的核心， 那「组合」就是Regular核心中的核心

<a name="body"></a>


## 内嵌内容(transcluded content)

### 『什么是内嵌内容?』


内嵌内容即被当前节点包裹的内容， 例如我们日常书写的html

```html
<ul>
  <li>One</li>
  <li>Two</li>
</ul>

```

`<ul>`的内嵌内容就是它的innerHTML，即

```html
  <li>One</li>
  <li>Two</li>
```

在上面的例子中，我们很容易的可以理解到`<li>`和`<ul>`是有__『结构上』__明显的父子关系的，这是一种最常见的组合关系. 

我们可以再来看看另一个例子`video`标签. 

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

这种其实更接近一种__『内容上』__的组合关系， `video`会使用到`source`节点的信息.


对于组件而言, 内嵌内容也是类似，即__被组件标签所包裹的内容__. 

```html
<modal on-confirm={this.ok()}>
  <p>Please input your password!!</p>
</modal>
```

其中`<p>Please input your password!!</p>`即为组件modal的内嵌内容, 

在Regular中，内嵌内容会成为组件的`$body`属性, 你可以通过`this.$body` 来得到它. 细心的朋友可以直接通过console发现这是一个函数

但问题问题来了, __『如何使用内嵌内容this.$body? 』__

## 内嵌内容可以解决什么问题.

指南的前面章节, 我们学习了内嵌组件的用法, 但基本停留在

```html
<modal></modal>
<!-- or self-closed  -->
<pager current={current} />
```

我举个基于Bootstrap的小结构, 在bootstrap下，有以下代表panel结构.

```html 
<div></div>
<div></div>
```

我们会发现, 所以很自然的

```html

<alert type='warn' message='dadasdjk' on-close={this.closeAlert()}></alert>

```

对应的我们可以设计出我们的alert组件的模板

```js
<div>
<div class="content">
 {message} 
</div>
<div class="close" on-click=close>x</div>
</div>
```

我们修改为. 但是当我们需要插入逻辑有， 计划永远赶不上变化.

```html
<div>
<div class="content" r-html={message}></div>
<div class="close">x</div>
</div>
```

此时， 我们可以使用include来使用

```html
<div>
  <div class="content">{#include this.$body}</div>
</div>
```

使用

```js
<alert>
  <h2>djaksdjal</h2>
  <p>askdjaksdjaksda</p>
</alert>
```


```javascript
var App = Regular.extend({
  template:
    '<modal title="title">\
      <a href="#" on-click={this.click()}>hello</a>\
    </modal>',
  click: function(){
    alert('passin-body"s context is outer component ')
  }
})

var app = new App({data: {title: "hahaha"}}).$inject('#app');
```

对于上层组件app而言， alert节点本省就像个容器，它内部的`this.$body` 的内嵌内容的作用域仍然属于App本身.

> 此时，__传入modal的`<a href="#" on-click={this.click()}>hello</a>`作用于在定义的component(即app实例)中，所以可以调用它原型上的click函数__

[|DEMO|](http://jsfiddle.net/leeluolee/4wuDZ/)


## 关于`this.$body`


### 神秘的`$body`到底是什么

好奇性中的同学可能已经发现了，当存在内嵌内容时， `this.$body`实际上是一个函数. 运行它相当于对『内嵌的模板』进行了一次编译动作并返回一个『块(Group)』, 「块」类似于一个阉割版的组件，也可以被插入到某个位置, 比如`this.$body().$inject(element)` , `#include 声明`事实上也是这么使用它的.

__当然永远不要这样去使用`this.$body`__, 这相当于一个课外知识 ,你只需要配合`#include`使用即可.

### 手动传入`$body`属性

在上面的例子中， 我们可以很方便的通过在组件节点之间插入内容来自定义组件需要的某些模板片断, 但这会引入一个问题，

__『当我们使用JS初始化组件时，如何定义内嵌内容？』__ . 你可以采用手动传入的方式

```js

var alert = new Alert({
  $body: "<a href='#' on-click={this.click()}>hello</a>"
})

```

此时`this.$body`是一个字符串. 运行之后你会发现也可以凑效, 这个是由于[{#include}]({{syntax}}#include)的特性决定的:

__『include同时也接受字符串作为参数』__

但是此时`$body`内容的this对象指向`alert`组件本身，因为此时，它只是一次常规的include引入.





## 视觉父节点(Visual Parent): `this.$outer` 


为了完善组合这个功能, Regular同时引入 __视觉父节点__ 这个概念. 首先我们以一个简单的tab组件为例来说明: 

```js

@TODO

```

[ __DEMO__ ]()

我们发现在`tab.pane`组件内， 我们可以通过`this.$outer`这个特殊属性来获得包裹它的组件`tab`. 我们称『`<tab></tab>`是`<tab.pane></tab.pane>`的视觉父节点』. 而本质上，它们同属于`application`这个组件的内嵌组件. 


利用`this.$outer`这个属性, 我们可以实现视觉父子组件之间的逻辑信息传递，它与`this.$body`可以创造出很多组件组合的实现方式.


## 小节


组合(composite)是个非常强大的功能, 而且在Regular中，内嵌内容的概念已经整合得足够简单和灵活， 你可以配合`{#include}` 或 `隐式组件` 有非常灵活的使用方式. 这也是Regular与其它许许多多的`web component`变体解决方案的本质差别. 

include + this.$body的组合从根本上帮我解决了『模板结构的自定义』的问题， 因为我们传递参数是无法传递指向当前组件的, 并且这种方式定义，我们从直觉上很容易将内嵌内容和『其视觉父节点』进行关联，并且也符合我们对于html的原本理解. 
