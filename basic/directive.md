
# 指令 Directive

指令是 __针对DOM节点__ 的功能增强。

> 由于组件的封装性， 需要自定义指令的需求应该是很少的

注意：__所有指令都只能在DOM节点上使用__

## 使用指令

当regular解析到一个属性时，例如 __`<div r-class={ {'z-active': isActive} } ></div>`__，首先会根据属性名去检查它是否是一个注册过的指令（通过[`Component.directive`]({{ref}}?api-zh#directive)）

- 如果是: 则完全交由指令的[link函数](#link)
- 如果否: 视为普通属性。


## 定义指令

每一个组件可以通过[`Component.directive`]({{ref}}?api-zh#directive)来扩展指令。定义接近于angular，我们需要理解的是其中的核心：link函数

<a name="link"></a>
### link(element, value, attrs)

1. element: 指令绑定的节点。
2. value:  指令其实只是一个属性声明，__它可能会有值__
    - 当值不是插值，value是一个字符串如`r-model='blog.title'`
    - 当值是插值，即类似`r-model={blog.title}`value是一个Expression对象
    - 当没有值，则传入`''` (空字符)
3. attrs: 一般不会使用，节点上得属性列表。
4. this: link中得this对象 __指向组件__

虽然以`r-xx={blog}`和`r-xx='blog'`的方式声明指令，在link函数中接受到value类型是不同的，
但由于`$update`、`$watch`等方法同时接受字符串和表达式对象，所以很多时候你无须关系是哪种方式进行的指令绑定。但如果你需要根据是否是表达式对象来做不同的处理，你可以利用__ `value.type === 'Expression'`__来判断。再利用`component.$get`(获得表达式的值)等方法来处理这个value即可。


__Example__

创建一个innerHTML与数据的绑定。`r-html='xx'` 或 `r-html={xx}` 都可以

```js
Regular.directive('r-html', function(elem, value){
  this.$watch(value, function(newValue){
    elem.innerHTML = newValue
  })
})
```


### 销毁函数

如果这个指令需要回收(比如link中创建了其它dom元素等), link函数需要返回一个函数用于指令销毁工作。
```js
Regular.directive("date-picker", function(){
    // blabla....
   return function (){
    // for destory directive
   } 
})
```

_上例中我们直接传入了函数，这是一种简写方式，此函数会成为指令定义的link函数。_

__Question__: 为什么要返回销毁函数，而不是通过监听 `$destroy`事件来完成？

__Answer__: 因为指令的销毁并不一定伴随着组件销毁，指令的生命周期更短，一些语法元素会导致它在组件销毁之前被重复创建和销毁：

1. if/else/elseif 
2. list 
3. include 

不过值得庆幸的是，__一切关于数据监听的事务，都无需回收__，比如你在link函数内部通过`this.$watch`进行了数据绑定，regularjs会进行自动收集。


## 实验: 实现一个表单双向绑定的指令

在这一小节，我们会实现一个`ng-model`来实现一个简单的表单双向绑定

__Example__

```html
<input type="text" ng-model={user.name} >
```


__即`ng-model`使得此表单节点元素获得了双向绑定的能力__，它与user.name实现了双向绑定，

假如要实现这个功能，很明显需要做两件事情：

1. 当user.name发生改变时，改变input的value
    我们可以通过API: $watch来实现这个功能
2. 当用户手动输入时，我们需要同时修改user.name的值
    通过监听节点的input事件来解决这个问题

__代码实现如下__ ：

```javascript

Regular.directive("ng-model", function(elem, exression){
    // make sure the  exression is An Expression
    var self = this;
    this.$watch( exression, function( nval ){
        elem.value = nval;
    }) 

    elem.addEventListener("input", function(){
        self.$update(exression, this.value); // enter digest
    })
})

```
[DEMO]()


这个DEMO缺陷还很多，比如：

1. 不支持非input文本类元素之外的其它节点类型比如select, input[type=checkbox]等等
2. 没有做`ng-model='user.name'`这样输入是文本而不是表达式的容错处理
3. 没有做兼容性处理
4. 没有考虑节点的初始值

但是不用担心，regularjs中已经内置了[r-model](./builtin.md)来实现更通用的支持。(所有内置指令都会以`r-`开头)

## 内建指令

Regularjs只内建了一些常用的指令，请[参考文档]()


## 指令来代替Dom操作的原因

因为 __组件概念__ 的存在，regularjs中指令的作用被大大弱化(angular中将组件化与指令杂糅在了一起)，但是 __对于针对具体节点的功能性增强__ ，我们仍然推荐使用指令来解决，而不是手动的操作do。原因如下：

1. 指令是一种可复用的抽象，
   亦如regularjs中的`r-model`指令，如果手动实现，你仍然需要大量的代码
2. 声明式的指令理解起来更加直观

    事实上，regularjs在文档中隐瞒了这一点:  __指令是可以后续主动绑定的__ ，不一定要通过模板生成。例如
    ```js
    init: function(){
        var directiveModel = Regular.directive("r-model");
        var input = this.$refs.input;
        directiveModel.link.call(this, input, 'blog.title');
    }
    ```
    _$refs请参见[文档]({{ref}}?api-zh#refs)，它用于获取模板中标记的节点或组件。当directive方法不传入factory时，它成为一个getter方法，用于获取指定的指令_

    但是在表现力上，它仍然没有在模板中声明来的直观。

