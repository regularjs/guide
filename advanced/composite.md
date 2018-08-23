
# 结构复用

> 如果说 __组件__ 是 Regular 的核心，那 __组合__ 就是 Regular 核心中的核心

通过上述章节的学习，我们明白可以轻松的使用基于类的继承体系来实现 **数据** 和 **逻辑** 的复用或重写，那如何做到结构的复用呢？

__这里我们引入一个本章贯穿的例子 - Card__

Card 即一个卡片的展示组件，为了复用，它需要两个可配置的部分：__标题__ 和 __内容区__

```html
<div class="ant-card ant-card-bordered">
  <div class="ant-card-head">
    <div class="ant-card-head-title">{title}</div>
  </div>
  <div class="ant-card-body">
    <p>{content}</p>
  </div>
</div>
```

<script async src="//jsfiddle.net/leeluolee/op2m5r9y/embed/result,js/"></script>

我们使用预埋的 `{title}` 和 `{content}` 可以实现 Card组件的标题和内容的 __文本覆写__，

__问题__: 可扩展性太差，比如「内容区需要富文本展示」或「标题区需要配置Icon」就无法满足了。

__解决__:可以使用HTML插值[`r-html`](../reference/directive.md#r-html)来实现静态结构的重写需求


## r-html - 静态结构复用

```html
<div class="ant-card ant-card-bordered">
  <div class="ant-card-head">
    <div class="ant-card-head-title" r-html={title}></div>
  </div>
  <div class="ant-card-body" r-html={content}>
  </div>
</div>

```


__使用__

```js
new Regular({
  template:`
   <Card 
    title='<i class="anticon anticon-user"></i>Card标题' 
    content={content} />
  `,
  data:{
    content: `
      <p>这是Card内容区一</p>
      <p>这是Card内容区二</p>
    `
  }
})

```

这里遗留一些问题，如片段无法使用事件、指令、语句、插值等等功能，本质因为`r-html`引入的内容是不经过编译的。

局部模板可以帮助我们解决这个难题。

## 局部模板复用 {#partial}

类似于[Handlebars的Partials](https://handlebarsjs.com/partials.html), Regular 中可以使用 include 语句来实现局部模板引入

__Example__

```html
const Card = Regular.extend({
  template:`
  <div class="ant-card ant-card-bordered">
    <div class="ant-card-head">
      <div class="ant-card-head-title" >{#include partialTitle}</div>
    </div>
    <div class="ant-card-body" >{#include partialContent}</div>
  </div>
  `
})
```

这里，我们重新定义一个新的组件 `IconCard` ,使得自定义`icon`的逻辑可以复用。 

```js
const IconCard = Card.extend({
  name: 'IconCard',
  config(data){
    data.partialTitle = `<i class="anticon anticon-{iconType}" />{title}`
    this.supr(data);
  }
})

```

__使用__

```js
new Regular({
  template:`
    <IconCard 
      title='card标题' 
      iconType='home' 
      partialContent='<p>这是Card内容区</p>' />
  `
})
```

<script async src="//jsfiddle.net/leeluolee/rtzm4y63/embed/result,js/"></script>

看似并没有什么节省代码，但当被复用的局部模板比较大时，收益就很客观了，而且可以避免暴露无关的细节。



### 局部模板的上下文

__局部模板的上下文与使用它的组件一致__，在声明式调用时可能会产生混淆。

__Example__

假设有如下一个 `App` 组件，其中 `Card` 与[上节定义](#partial)一致。

```js

const App = Regular.extend({
  template:`
    <Card
      partialTitle={partialTitle}
      partialContent={partialContent} />
  `,
  config( data ){
    data.partialTitle = '标题'
    data.partialContent = '<p on-click={this.clickContent()} >内容:{content}</p>'
  },
  clickContent(){
    alert('App 点击内容')
  }
})


const app = new App({
  data: {
    content: 'App Content'
  }
}).$inject('body');

```

由于事件绑定和文本插值实际上都没有指向app, 而是指向内部的Card组件实例，所以没有达到需要的效果。

<script async src="//jsfiddle.net/leeluolee/h0tgj1om/embed/result,js/"></script>

针对这个问题，Regular 提供另一种include的使用方式，类似于其他框架的slot插槽。

## 内嵌内容 - this.$body

### 什么是内嵌内容?

内嵌内容即被当前节点包裹的内容，例如我们日常书写的HTML

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

而对于 Regular 而言，内嵌内容也是类似，即 __被组件标签所包裹的内容__

```html
<Card>
  <p on-click={this.clickContent()}>{content}</p>
</Card>
```

其中`<p on-click={this.clickContent()}>{content}</p>`即组件Card的内嵌内容，在组件里你可以通过`this.$body`来使用它


### 使用内嵌内容 {#body}

还是以[Card](#partials)为例，仍然使用 include 语句，但是引入内容修改为`this.$body`。

```html
<div class="ant-card ant-card-bordered">
  <div class="ant-card-head">
    <div class="ant-card-head-title" >{#include title}</div>
  </div>
  <div class="ant-card-body" >{#include this.$body}</div>
</div>
```



```js

const App = Regular.extend({
  template:`
    <Card title='标题' >
      <p on-click={this.clickContent()}>{content}</p>
    </Card>
  `,
  clickContent(){
    alert('点击内容')
  }
})


const app = new App({
  data: {
    content: 'App Content'
  }
}).$inject('body');

```

<script async src="//jsfiddle.net/leeluolee/p1aoy0Le/embed/result,js/"></script>

这里，我们发现如我们之前所期待的，事件和文本绑定都指向了`App`。 这是因为

> 被引入的内嵌内容的上下文指向声明它的组件，_类似我们的词法作用域，取决于定义的地方_，这样更符合我们的使用直觉


## Fragment {#fragment}

在Regular中，类似`this.$body`表现的数据类型，我们称之为 Fragment。

__使用Fragment达到结构复用目的行为被称为组合__

我们已经知道，内嵌内容会成为组件的实例属性`$body`, 但它也决定了每个组件只能声明一个内嵌内容，如果我们需要使用多个Fragment该怎么办？

你可以通过`{~ }`插值来实现任意个数的Fragment引入。


### Fragment插值 `{~}`


__Example__

以[上节例子](#body)为基础，我们可以这样传入title


```js
const App = Regular.extend({
  template:`
    <Card
  		title={~ <i class="anticon anticon-close" on-click={this.clickClose()} ></i> <span> 测试标题 </span>  } >
      <p on-click={this.clickContent()}>{content}</p>
    </Card>
  `,
  clickContent(){
    alert('点击内容')
  },
  clickClose(){}{
    alert('点击关闭')
  }
})

const app = new App({
  data: {
    content: 'App Content'
  }
}).$inject('body');
```

<script async src="//jsfiddle.net/leeluolee/kL91souz/embed/js,result/"></script>

Fragment插值的效果与内嵌内容完全一致。


## 视觉父节点 {#visual}


参考以下例子

```js

const Icon = Regular.extend({
  name: 'Icon',
  template:`
    <i class="anticon anticon-{type}"></i>
  `
})

const App = Regular.extend({
  template:`
    <Card title={~ <Icon type='user' /> 我是标题 } >
      <Icon type='user' /> 我是内容区 
    </Card>
  `
})

```

上例中，因为App内声明的`<Icon />`和`<Card />`的上下文是一致的，他们的[直接父组件`$parent`](../basic/component#parent)都是`App`。 


__问题：__`<Icon />`如何获得实际使用它(通过`#include`语句)的`<Card />`组件呢？


### `this.$outer`

如果一个组件是通过Fragment的方式使用，组件实例存在一个`$outer`属性指向使用它的组件，我们称之为 __视觉父组件__。

有别于 __直接父组件__，他们之间没有直接的数据关系(但可能存在间接关系)。


```js
const Icon = Regular.extend({
  name: 'Icon',
  template:`
    <i class="anticon anticon-{type}"></i>
  `,
  init(){
    console.log(this.$outer.name) ; //Log Card
  }
})

```
