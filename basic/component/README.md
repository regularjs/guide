# 组件 - component

「组件化」不仅仅是标签化这种表现层面的描述

> 在用户端开发领域，组件应该是一种独立的、可复用的交互元素的封装。

Regular的组件满足以下等式

> 组件 = 模板 + 数据 + 业务逻辑


__提示__

- 本节会简单涉及到 [DOM事件](../event.md#dom)

## 组件基础

使用 __[Component.extend](../../reference/api.md#extend)__ 定义一个可复用的组件

```js

const Component = Regular.extend( {
  template: `<button on-click={count+=1}> 你点了{count}次按钮 </button>`,
  config( data ){
    data.count = 0;
  }
});

```


`extend` 返回的是一个组件构造函数，你可以直接使用 `new` 关键字进行实例化

```js

new Component().$inject(document.body)
new Component().$inject(document.body) //可以重复使用

```


<script async src="//jsfiddle.net/leeluolee/3qt2g0mo/embed/result,js/"></script>

__参考__

- __[api - $inject](../../reference/api.md#inject)__: 插入组件到指定节点位置,或恢复组件到游离状态（脱离文档）


### 声明式调用

除了通过`new`实现命令式初始化，Regular 支持在别的组件模板中使用声明式调用，这是最常见的使用方式。

```js
// 注册名为Component的全局组件
Regular.component('Component', Component)

new Regular({
  template:`
    <Component ></Component>
    <Component/> <!-- 自闭合 -->
  `
})

```


效果与上例完全一致

<script async src="//jsfiddle.net/leeluolee/nwds9g6c/embed/result,js/"></script>


__参考__

- __[api - Component.component](../reference/api.md#component)__: 组件注册


### 全局别名快捷设置 - name

因为上例这种注册到全局的方式比较普遍, __Regular 支持在 extend 时，直接设置别名__

```js
Regular.extend({
  name: 'Component' // 设置全局别名
  //...
})
```


## 组件的参数传入与绑定 {#prop}

__data__ 在 Regular 中是个特殊的实例属性，根据 [索引：表达式](../../reference/expression.md) 所述

> 数据根路径从 component.data 开始,即 {user} 其实获取的是 component.data.user

实际上在模板里也可以拿到实例上的其它属性，比如 `{this.nickName}` 拿到的就是实例上的nickName字段，例如

```js

new Regular({
  template:`
    <div>{this.nickName}</div>
    <!-- 相当于 this.data.userName -->
    <div>{userName}</div>
  `,
  nickName: 'leeluolee',
  data: {
    userName: 'hzzhenghaibo'
  }
})
```

这样看起来，似乎 __data__ 仅仅只是个短写的语法糖而已。 其实不尽然，因为

> __只有data上的字段可以通过声明式属性传入__


```html

<Component title='hello' />

```

就相当于


```js

new Component({
  data: {
    title: 'hello'
  }
})

```

节点属性会自动成为`data`对象上的字段。

### 参数传递细节说明 {#data}


#### 传入属性都会成为data的成员

```html
  <Component total=100 title='Hello' ></Component> 
```

相当于`data.total='100'`, `data.title='Hello'`

> 注意非属性插值，则传入类型都是字符串

#### 插值创建双向绑定

如果存在插值则会双向绑定，如下例的title与外层的`title`字段就形成了双向绑定

```html
<Component   title={title} show={true} />
```

__例外__：在这里 `show={true}` 比较特殊，因为表达式是一个静态值，所以不会产生双向绑定。

#### value 缺省,则默认成为Boolean值`true`

```html
<Component show ></Component>
```
上例相当于 `<Component show = {true} />`

#### 连缀格式转驼峰

```html
  <Component show-modal={true} isHide={hide}/>
```
则 `show-modal` 会转换为 `showModal`， 但是 `isHide` 这种驼峰式的写法仍然支持，并不做变换

#### 事件指令

满足`on-[eventName]`的属性会自动转换为[组件事件绑定](../event.md)

```html
  <Component on-nav={this.nav($event)}></Component>
```

#### 其它特殊属性

特殊属性如`ref`和`isolate` 会有特殊的功能。请参考 [获取内部节点和组件](./ref.md) 和 [组件隔离](./isolate.md)

### 禁止在extend中定义缺省data参数 {#default} 

__⚠️不要在 extend 或 implement 时定义data属性 !!!__ ，这会导致所有实例共享数据。




```js
const Component = Regular.extend({
  name: 'Component',
  template: `
    <h2>{title}</h2>
    <button on-click={shared.count+=1}>点击shared.count+1: {shared.count}</button>
    <button on-click={instance.count+=1}>点击instance.count+1: {instance.count}</button>
  `,
  data: {
    shared:{
      count:1  // 会影响到所有实例
    }
  },
  config(data){
    data.instance = {count: 1} // 每个实例独有
  }
}) // 每个实例独有
```

<script async src="//jsfiddle.net/leeluolee/do4m1erf/embed/result,js/"></script>


__参考__

- [风格指南：禁止在 extend 中定义缺省 data 参数](../../reference/styleguide.md#)



## 生命周期钩子

Regular 提供了几个常用的生命周期钩子，你可以实现指定方法来处理自定义逻辑


### config( data ) - 在模板编译前调用


```js
Regular.extend({
  config( data ){
    data.title = data.title || '默认标题'
  }
})

```

- data: __合并传入参数__后的data对象

__参考__

- [参数传递](#prop)



### init - 在模板编译后调用


在这个阶段，已经可以获取到生成的节点，__但是仍然是游离状态的，未插入到实际DOM节点中__

```js
Regular.extend({
  template: `<div ref=container>Hello</div>`,
  init(){
    console.log(this.$refs.container.innerHTML === 'Hello'); //true
  }
})
```


__参考__

- [获取子节点和子组件](./ref.md)




### destroy - 在组件销毁前调用

销毁函数 , __注意__ 如果要自定义回收函数，务必调用父类 destroy(`this.supr`)来销毁掉一些通用部分(如事件监听，数据监听)


```js
const Component = Regular.extend({
    init(){
      this.onScroll =  function(){};
      window.addEventListener('scroll', this.onScroll)
    },
    destory(){
        this.supr(); // 千万别忘记
        window.removeEventListener('scroll', this.onScroll)
    }    
})
```




### modifyBodyComponent 

请参考 @TODO

### 生命周期图示

__实例化时__

![](http://p1.music.126.net/fMaWu1OPgVHz_0aP9Z5SaQ==/109951163409731716.png)

__销毁时__
![](http://p1.music.126.net/wMn6NWuOolhxXd1Ekfo-ow==/109951163409729417.png)


## 动态组件

Regular 提供了 `r-component` 用于处理动态组件的需求，这个组件使用is属性来决定使用什么组件来渲染

- is: 组件名

如下例，我们预先定义了`MarkdownRender` 与 `HtmlRender`两个组件

```js

Regular.extend({
  name: 'MarkdownRender',
  template: `<div r-html={mdcontent} ></div>`,
  config(data){
    this.$watch('content', (content)=>{
      data.mdcontent = marked(content)
    })
  }
})

Regular.extend({
  template: `<div r-html={content}</div>`,
  name: 'HtmlRender'
})
```

使用`r-component`来动态实例化组件，注意is属性是个动态插值

```js

<input type="radio" value='MarkdownRender' r-model={type} /> 使用markdown
<input type="radio" value='HtmlRender' r-model={type} /> 是否使用mdrender
<r-component is={type} content={content} />

```




<script async src="//jsfiddle.net/leeluolee/a50rbLfh/embed/result,js/"></script>


__参考__

- 其余属性都会成为指定组件的`data`参数，请参考[组件参数小节](#prop)
- [数据监听](../data-binding.html#watch)

## 其它事项

### 没有单节点限制

Regular 的模板和一些框架不同，它没有[单节点限制](../statement#wrap-limit)，在描述结构时可以更加自由

```javascript

Regular.extend({
  template: `
    <strong>Hello, </strong>
    {username}
    <em>Nice to meet you</em>
  `
})

```

此时默认使用 [Regular.dom.element](../../reference/api.md#dom) 将只能获取到第一个节点，如果你需要获取到所有节点可以传入第二个参数，此时将返回包含所有节点的数组

```js
Regular.dom.element(component, true);
```


