#API索引

由于API介绍分散在了本书各个章节，为了方便对照，本小节做了所有API的索引



# 静态接口

静态接口有些是只属于`Regular` 而有些是属于`Component`(即Regular及其子类)通用，如下所示。


1. [Component.extend](../core/class.html#extend): 定义Regular组件
7. [new Component](../core/class.html#instance): 实例化组件
1. [Component.implement](../core/class.html#implement): 扩展组件原型
2. [Component.directive](../core/directive.md): 扩展指令
3. [Component.filter](../core/filter.md):       扩展过滤器
4. [Component.event](../core/event.md):         扩展自定义事件
5. [Component.animation](../core/animation.md)  扩展自定义动画
6. [Component.use](../core/use.md)              使用一个插件
7. [Regular.expression](../syntax/expression.html#expression) 创建一个表达式对象



# 实例接口

component即代表组件实例，注意这些公有都有`$`前缀 意味不建议进行重写

1. [component.$watch](../core/binding.html#watch):     创建一个数据监听
2. [component.$unwatch](../core/binding.html#unwatch)  解绑一个数据监听
3. [component.$update](../core/binding.html#update)    更新一个数据并进入digest(类似angular的$apply)
4. [component.$get](../core/binding.html#get)          获得一个表达式的值(类似angular的$eval)
5. [component.$bind](../core/binding.html#bind)        创建组件之间的双向绑定
6. [component.$on](../core/message.html#on)            创建一个事件监听器(非dom)
7. [component.$off](../core/message.html#off)          解除一个事件监听(非dom)
8. [component.$emit](../core/message.html#emit)        触发一个事件监听(非dom) 
9. [component.$inject](../getting-start/quirk-example.html#inject)  插入组件到指定位置 


xian

# 内置模块

1. [指令directive](../core/directive.html#buildin)


# Regular中的内置帮助函数集



## Regular.dom

提供基本的操作dom帮助，注意Regularjs并没有封装成类似jqLite的对象，而是纯粹的静态方法。


## Regular.util

提供一些通用帮助方法的支持



## Regular.config
Regular的一些配置项



