
# 指令

regularjs中指令的定位是: __针对某一个节点的特定功能增强__, 因为regularjs把大部分抽象的职责都迁移到了__组件__这个概念中。



## 定义

每一个组件可以通过[`Component.directive`]({{ref}}?api-zh#directive)来扩展指令. 定义接近于angular， 但是极度简化: 

1. link(element, value, attrs): 链接函数
    1. element: 指令绑定的节点. 
    2. value:  指令其实只是一个属性声明， __它可能会有值__
        - 当值不是表达式, value是一个字符串如`r-model='blog.title'`
        - 当值是表达式, 即类似`r-model={blog.title}`value是一个Expression对象
        - 当没有值， 则传入undefined
    3. attrs: 一般不会使用， 节点上得属性列表.
    4. this: link中得this对象__指向组件__

2. priority: 指令权重, 默认为1， 一个节点上得指令初始化顺序根据指令权重按序执行.

除此之外，再无其它。 无需去关心prelink， postlink, compile, transclude, controll, scope 等等angularjs中令人眼花缭乱的概念.


如果这个指令需要回收(比如link中创建了其它dom元素等), link函数需要返回一个函数用于指令销毁工作.

```
Regular.directive("date-picker", function(){
    // blabla....
   return function (){
    // for destory directive
   } 
})
```
_上例中我们直接传入了函数， 这是一种简写方式， 此函数会成为指令定义的link函数._

__Question__: 为什么要返回销毁函数， 而不是通过监听 `$destroy`事件来完成 ?

__Answer__: 因为指令的销毁并不一定伴随着组件销毁, 指令的生命周期更短, 一些语法元素会导致它在组件销毁之前被重复创建和销毁:

1. if/else/elseif 
2. list 
3. include 

不过值得庆幸的是，__一切关于数据监听的事务， 都无需回收__, regularjs回进行自动记录以及收集.




    
## 实验: 实现一个表单双向绑定的指令

在这一小节， 我们会实现一个`ng-model`来实现一个简单的表单双向绑定

__Example__

```html
<input type="text" ng-model={user.name} >
```


__即`ng-model`使得此表单节点元素获得了双向绑定的能力__, 它与user.name实现了双向绑定,

假如要实现这个功能， 很明显需要做两件事情: 

1. 当user.name发生改变时， 改变input的value
    我们可以通过API: $watch来实现这个功能
2. 当用户手动输入时， 我们需要同时修改user.name的值
    通过监听节点的input事件来解决这个问题

__代码实现如下__: 

```javascript

Regular.directive("ng-model", function(elem, exression){
    // make sure the  exression is An Expression
    var self = this;
    this.$watch( exression, function( nval ){
        elem.value = nval;
    }) 
    function updateModel(){
        exression.set(self, elem.value);
        self.$update(); // enter digest
    }
    elem.addEventListener("input", updateModel);
})

```
[DEMO]()


这个DEMO缺陷还很多, 比如: 

1. 不支持非input文本类元素之外的其它节点类型比如select, input[type=checkbox]等等
2. 没有做`ng-model='user.name'`这样输入是文本而不是表达式的容错处理
3. 没有做兼容性处理
4. 没有考虑节点的初始值
5. 当Expression不是可设值得时候， 应该给与提示. 比如: {user.firstName + user.lastName}这个表达式, 显然是不可以设值的

但是不用担心， regularjs中已经内置了[r-model](./builtin.md)来实现更通用的支持. (所有内置指令都会以`r-`开头)




## 指令来代替Dom操作的原因

因为__组件概念__的存在， regularjs中指令的作用被大大弱化(angular中将组件化与指令杂糅在了一起), 但是__对于针对具体节点的功能性增强__， 我们仍然推荐使用指令来解决，而不是手动的操作dom. 原因如下:

1. 指令是一种可复用的抽象， 
   亦如regularjs中得`r-model`指令, 如果手动实现，你仍然需要大量的代码
2. 声明式的指令理解起来更加直观

    事实上， regularjs在文档中隐瞒了这一点: __指令是可以后续主动绑定的__, 不一定要通过模板生成。 例如
    ```js
    init: function(){
        var directiveModel = Regular.directive("r-model");
        var input = this.$refs.input;
        directiveModel.link.call(this, input, 'blog.title');
    }
    ```
    _$refs请参见[文档]({{ref}}?api-zh#refs), 它用于获取模板中标记的节点或组件. 当directive方法不传入factory时， 它成为一个getter方法，用于获取指定的指令_

    但是在表现力上， 它仍然没有在模板中声明来的直观. __并且__模板中得指令是会自动进行回收的. 