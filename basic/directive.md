
# 指令 - directive

指令是 __针对DOM节点__ 的功能增强。

注意：__所有指令都只能在DOM节点上使用， 无法在组件上使用__

## 使用指令

当 Regular 解析到一个属性时，例如 __`<div r-class={ {'z-active': isActive} } ></div>`__，会根据属性名去检查它是否是一个指令（通过[`Component.directive`](../../reference/api.md#directive)定义）

- 如果是: 则完全交由指令处理
- 如果否: 则视为普通属性

```html
<h2 r-html={title} title={title} ></h2>
```

上例中，[`r-html`](../reference/directive#r-html) 就是一个指令， `title`则是一个普通属性插值。

## 定义指令

### 初始化：directive.link(elem, value, name, extra) {#link}

每一个组件可以通过[`Component.directive`](../reference/api.md#directive)来扩展指令，其中最关键的就是 `link` 方法，它用来处理指令的启动

以下面的`html`的插值指令为例(实际上这也是内部`r-html`的实现), `innerHTML`会相应数据的变更

```js

Regular.directive('html', {
    // elem指向当前节点，value即传入属性值
    link( elem, value ){
        this.$watch(value, val => {
            elem.innerHTML = val;
        })
    }
})

```

__参考__

- [数据监听](./data-binding.html#watch)

__使用__

```html
<div html={content} ></div>
```

> 注意这里 Regular 指令的命名是没有要求的，但建议工程中有一个统一前缀来区分于普通属性

<script async src="//jsfiddle.net/leeluolee/9tshngc1/embed/result,js/"></script>

#### 指令属性值说明

这里需要说明的是，属性值即 [指令link](#link) 的第二个参数，有三种可能

- 属性不是插值，`r-html='blog'`，则入参即为对应字符串如`'blog.title'`
- 属性是插值，即类似`r-html={blog.title}`，value是一个 [Expression对象](../reference/expression.md#setable)
- 当没有值，如 `<div r-html></div>`则传入`''` (空字符)


你可以根据自己的需要作对应的判断

### 更新逻辑：directive.update(elem, value, oldValue, extra)

由于绝大部分场景都如[上例](#link) 类似，只需要处理数据变更的情况，此时可以选择更简洁的update方法

```js

Regular.directive('html', {
    update(elem, value){
        elem.innerHTML = value
    }
})

```

是不是简便了许多？

<script async src="//jsfiddle.net/leeluolee/gejx4r1w/embed/result,js/"></script>

__说明__

- 如果传入值是表达式(`如{blog.title}`)，update会在 __初始化__ 和 __值变更时__ 触发
- 如果是空或文本，update会只在__初始化__触发一次，不会产生绑定

> ⚠️ 在`0.6.0`版本以前, Regular有一个已知Bug —— 
> `update` 函数必须在link函数存在时才会生效，所以至少需要定义一个空的link函数

### 指令参数: directive.param

- param: 指令的参数属性名的配置

有些场景，指令可能需要辅助的参数，Regular 支持指令声明式依赖其他属性作为参数


例如，用`html`指令实现一个超出指定字符就显示`...`省略符号的需求

```js
Regular.directive('html', {
    param: ['limit'],
    update(elem, value, oldvalue, extra){
        const limit = parseInt( extra.param.limit, 10);
        const htmlStr = value.length > limit? htmlStr.slice(0, limit) + '...': value;
        elem.innerHTML = htmlStr;
    }
})
```

<script async src="//jsfiddle.net/leeluolee/frtLdovk/embed/result,js/"></script>

`extra.param`即我们接受的参数集合的对象。

__说明__

1. 指令参数目前没有变更的监听函数，所以无论是否传入的是表达式，都只有初始值
2. 指令参数属性将不会进入正常[属性的流程](#process)
3. link 和 update 都接受extra参数

## 指令销毁

如果你的指令需要销毁逻辑，比如在指定启动时，引入了全局状态，只需要在link函数中返回一个`Function`即可

```js
Regular.directive("lazy-load", function(){
    document.addEventListener('scroll', onScroll);
    return function (){
        document.removeEventListener('scroll', onScroll);
    } 
})
```

_上例中我们直接传入了函数，这是一种简写方式，此函数会成为指令定义的link函数。_

__Question__: 为什么要返回销毁函数，而不是通过监听 `$destroy`事件来完成？

__Answer__: 因为指令的销毁并不一定伴随着组件销毁，指令的生命周期更短，一些语法元素会导致它在组件销毁之前被重复创建和销毁：

1. if / else / elseif 
2. list 
3. include 

不过值得庆幸的是，__一切关于数据监听的事务，都无需回收__，比如你在link函数内部通过`this.$watch`进行了数据绑定，Regular 会进行自动收集。

## 属性解析的流程示意图 {#process}

![](https://p1.music.126.net/IGxzgyNNymUfatbAGuIH-A==/109951163413158092.png)


__参考__

- [基础:事件](./event.md)


## 内建指令 {#builtin}

移步[索引:内建指令](../reference/directive.md)

## 指令优于DOM操作的原因

因为 __组件概念__ 以及语句的存在，Regular 中指令的作用被大大弱化，但是 __对于针对具体节点的功能性增强__ ，仍然推荐使用指令来解决，而不是手动的操作DOM。原因如下：

1. 指令是一种可复用的抽象，
   亦如Regular中的[`r-model`](../reference/directive.md#r-model)指令，如果手动实现，你仍然需要大量的代码
2. 声明式的指令理解起来更加直观



