# regularjs指南


> <b>版本 0.3.0后regularjs 改变标签为 `{}`</b>, 你可以使用`Regular.config({BEGIN:'{{', END: '}}'})` 来返回到原语法


regularjs是一个基于字符串模板的用于创建数据驱动的组件的类库, 相较于其它同类的基于字符串的模板引擎比如(mustache), regularjs在compile之后数据和dom仍然保持联系, 所以也称之为'live template engine'.

regularjs的更高层次的目的是__规范有序(regular)__的去定义组件的业务逻辑. 它可以创建拥有独立生命周期的组件，从而可以__无缝的与任意框架集成__.



本书是[reguarljs](https://github.com/regularjs/regular)的官方指南， 会放置一些独立的指南.



## 你也许需要

* [API Reference](http://regularjs.github.io/api?api-zh)
* [Syntax Reference](http://regularjs.github.io/api?syntax-zh)

-----------

__指南命名约定__

* __Component__  指代所有Regular和继承自Regular的组件(Regular.extend)
* __component(小写)__  指代所有__Component__的实例











