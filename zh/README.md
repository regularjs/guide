# regularjs指南

> ## 中文指南目前未更新到最新版，请稍等几天或查看[英文版文档](http://leeluolee.gitbooks.io/regular-guide/en/index.html)

regularjs是一个可以实现类似angularjs的数据绑定功能的模板引擎, 相较于其它同类的基于字符串的模板引擎比如(mustache), regularjs在compile之后数据和dom仍然保持联系, 所以也称之为'live template engine'.

regularjs的更高层次的目的是__规范有序(regular)__的去定义组件的业务逻辑. __基于字符串模板__的它可以创建拥有独立生命周期的组件，从而可以__无缝的与任意框架集成__.

同时这个词可以拆解成

> __regular = react(ractive) + angular__

也意味着regular结合了angular的__数据脏检查机制__和react的__组件化思想__等等特性.


本书是[reguarljs](https://github.com/regularjs/regular)的官方指南


-----------

>接下来的指南的命名约定
* __Component__  指代所有Regular和继承自Regular的组件(Regular.extend)
* __component(小写)__  指代所有__Component__的实例








