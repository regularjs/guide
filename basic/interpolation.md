# 插值 {#interpolation}


插值是Regular最常用特性，包括

- [文本插值](#text) - 针对文本节点
- [属性插值](#attr) - 针对DOM节点
- [参数插值](#prop) - 针对声明式组件
  - [Fragment参数](#fragment) - 片段参数

他们语法都是类似，即`{Expression}`，`{}`也称为表达式容器。

__参考__

> 其他场景也可以使用表达式，具体参考[表达式使用场景](../reference/expression.md#case)

##文本插值 {#text}

- 举例: `<div>{username}</div>`

针对文本插值，Regular 会创建一个 textNode, 并建立表达式到`textContent`的 __单向数据绑定__


__Example__

```js

const app = new Regular({
  template: "<div>{username}</div>",
  data: {username: 'leeluolee'}
});

app.$inject('#app');


```


上面的例子会输出`<div>leeluolee</div>`，并且一旦数据发生改变，文本节点内容也会发生改变

>由于是单向绑定，你直接修改textContent是无法反向映射到数据的，而且会导致单向绑定失效


## 属性插值 {#attr}

举例: `<div title={blog.title} >haha</div>`

针对属性插值，Regular 会创建一个对应名称的属性节点，并创建表达式到 __属性值__ 的单向绑定。


__几个注意点__

1. 如果文本内部具有插值符号`{}`, Regular 会解释成组合表达式，如`'.modal-{klass} z-{state}'` 就相当于是 `'.modal-' + klass + 'z-' + state`。

2. 对于非指令类的的属性, Regular 会在值变化时, 修改对应属性, 即一般属性(`class`, `style`，`title`等)是天生可插值的。

3. 对于指令类的属性, Regular 会将具体处理逻辑交由[指令](./directive.html)处理。

4. 由于是单向绑定，你通过 DOM API 修改属性值是无法反向映射到数据的，而且会导致单向绑定失效


__Example__

```javascript

<input
  type='number'
  class={klass}
  r-model={value}
  style="left: {value}px"
  > 

```

上述几个属性结果如下

1. `r-model`: 参考[内置指令](./directive.html#r-model)
2. `style`: 字符串组合插值, 等价于 `"left: " + value + "px"`
3. `class`: 简单属性插值
4. `type`: 简单属性赋值，没有绑定

<script async src="//jsfiddle.net/leeluolee/kdrfab2m/embed/js,css,result/"></script>


{%raw%}
__FAQ__

- Regular中，class不是关键字，你可以直接使用
- 部分接受对象类型的指令如 [r-style](directive.md#r-style)，请注意`r-style={'left': '10px'}` 是错误的赋值，因为`'left': '10px'`不是合法表达式，`{{'left': '10px'}}`才是正确的写法

{%endraw%}

## 参数插值 {#prop}


- 举例: `<component title={blog.title} />`

通过参数插值传入组件数据，并创建外层组件字段(如上例 `blog.title` )到内部组件字段(如上例 `title`)的 __双向绑定__

注意如果[表达式不是setable](../reference/expression.md#setable)的(如 `title={blog.title + ':' + blog.subTitle}`), 将只会创建外层组件到内层组件的 __单向绑定__

关于参数插值，请直接看[组件章节](./component#prop)


### Fragment片段参数 {#fragment}

Regular还支持一种模板片段的插值，称为，它与组件结构的复用能力直接相关，如

```html
<Card title={~ <Icon type='user' /> 我是标题 } >
  <Icon type='user' /> 我是内容区 
</Card>
```


更多解读请直接参考[组合 - 结构复用](../advanced/composite.md#fragment)







