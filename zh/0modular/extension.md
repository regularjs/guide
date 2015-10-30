# 组件的功能扩展以及命名空间

根据上几章的介绍， 我们知道了所有regularjs组件都支持这几种扩展.

1. filter: 过滤器扩展
2. directive: 指令扩展
3. event: 扩展一个自定义事件
4. animation: 扩展一个新的[动画command](../animation/command.md)
5. component: 注册一个组件, 使其在当前组件的模板中可用.
6. implement: 扩展组件的原型方法


这些扩展拥有一些共性

## 扩展接口的单向影响性

这几位的共同特点就是 __[扩展只对定义它的Component及其子类可见]__ 如


```javascript
Regular.event('tap', tap)

var Child = Regular.extend();
var SubChild = Children.extend();

Child.event('tap2', tap2)

alert(Regular.event('tap') === tap)
// Child's extension will not affect Parent
alert(Regular.event('tap2') === undefined)

alert(Child.event('tap') === tap)
alert(Child.event('tap2') === tap2)

// but affect SubChild
alert(SubChild.event('tap2') === tap2)

// filter，directive is the same
```

即父类无法获得子类定义的扩展, 而反之可以, 这个最基本的概念是实现regular的插件化的第一步.

对于implement无需多做解释, 这是原型继承的基本原理, 而对于其它几个接口, 是通过定义的原型继承`Object.create()`来实现的

__单向影响性__ 是实现regularjs封装性的第一步.

## 建立项目内独立的隔离空间

对于建立独立的隔离空间,聪明的同学可能已经想到了: 

> 即定义一个不会被实例化的组件来替代Regular顶层空间.

```javascript
var YourNameSpace = Regular.extend()

YourNameSpace.filter().directive().event() //....

var Component = YourNameSpace.extend();
```

这样, 独立项目内的扩展就不会影响到产品中的其它Regular组件了, 而扩展自NameSpace的组件可以拥有所有组件内的功能扩展.


---

下一章， 我们会来学习下， 如何实现一个完整的regularjs插件.

