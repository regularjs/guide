#API索引

由于API介绍分散在了本书各个章节, 为了方便对照, 本小节做了所有API的索引



# 静态接口

静态接口有些是只属于`Regular` 而有些是属于`Component`(即Regular及其子类)通用, 如下所示.


1. [Component.extend](../core/class.html#extend)
7. [new Component](../core/class.html#instance)
1. [Component.implement](../core/class.html#implement)
2. [Component.directive](../core/directive.md)
3. [Component.filter](../core/filter.md)
4. [Component.event](../core/event.md)
5. [Component.use](../core/use.md)
6. [Regular.expression](../syntax/expression.html#expression)



# 实例接口

component即代表组件实例, 注意这些公有都有`$`前缀 意味不建议进行重写

1. [component.$watch](../core/binding.html#watch)
2. [component.$unwatch](../core/binding.html#unwatch)
3. [component.$update](../core/binding.html#update)
4. [component.$bind](../core/binding.html#bind)
5. [component.$on](../core/message.html#on)
6. [component.$off](../core/message.html#off)
7. [component.$emit](../core/message.html#emit)




# Regular中的内置帮助函数集



## Regular.dom

提供基本的操作dom帮助，注意之类并没有封装成类似jqLite的对象，而是纯粹的静态方法.


## Regular.util

提供一些通用帮助方法的支持



## Regular.config
Regular的一些配置项