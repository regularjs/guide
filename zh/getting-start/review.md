
#本章小结


在这一小节，我们利用regularjs实现了一个最简单的组件——HelloRegular.

你可以将regular创建的组件想象成一个小型的`mvvm`模式的闭环.它

- 独立的生命周期
- 模板`template`
- 数据模型`data`,不过它是完全无逻辑的,操作依赖于component实例
- 而组件本身即相当于一个`viewmodel`, 原型上定义了组件的所有业务逻辑





如果你仍意犹未尽，可以查看这个[todomvc的例子](http://jsfiddle.net/leeluolee/5Err9/)来熟悉下更完整些的regular组件实现方式。



--------------------

下一个章节，指南将详细介绍下regularjs中的内建模板的语法和用法