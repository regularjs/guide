# 模板


### __[&#x27AD;阅读模板文档](http://regularjs.github.io/reference/?syntax-zh)__

Regularjs内建了一个蝇量级的模板解析(称之为rgl)，从字符串解析到中间AST再进行Living DOM的创建，也就是所谓的『Living Templating』的技术。技术方案总归是优劣并存，之所以选择这个市面上接受度不高的方案，除了是为了方便推广给我司熟悉JST的同学外，主要还有以下几点原因

- 更安全: 全程无innerHTML
- 更灵活: 不用再被ng-if ng-repeat等限制在单节点上
- 可重用+序列化: 信息都在AST上，和cloneNode + link说再见 
- 更高效: 最终生成Living DOM与Angular等Dom-based的框架是一致的，即也可以实现局部更新。

更多理解可以参考我的这篇博文[『前端模板技术面面观』](http://leeluolee.github.io/2014/10/10/template-engine/)


## 语法设计

从语法角度讲，rgl很接近网易杭州大部分使用的后端模板ftl和前端模板jst的结合，只有两个类型。

- 功能语句: 如`{#list Expression as Var } ...  {/list}` 
- 插值语句: 即`{ Expression }`

它们都由『开符号』和『闭符号』包裹，这样做的目的是方便只修改开闭符号就进行语法的替换，目前你可以通过下述代码修改开闭符号。

```js
Regular.config({
  'BEGIN': '{{',
  'END': '}}'
})
```


## 表达式

在模板语法中最重要的就是表达式(如`user.age + 12`。动态模板中，一个富表达式的支持几乎是必须的。因为与一次性的字符串模板不同，动态模板产生的中间状态非常多，如果每种中间状态都必须和mustache这种弱逻辑模板一样，需定义成静态字段(例如`blog.title`)，那限制就太强了。

Regular的表达式支持

- ES5除了位操作符(考虑要支持)的一元、二元和三元操作符的支持
- undefined错误抑制(相信你快被JS中的` Cannot read property 'xx' of undefined`搞昏了)
- 一次性绑定`@(Expression)`表达式
- `Expression|fitlerName: arg1, arg2`表达式


### 表达式对象

所有的表达式在编译后会成为一个『表达式对象』，通过对于开发者而言，只会在[指令定义](basic/directive.md)中会接触到它。它包含两个个部分


* __get(context)__

  即这个表达式的求值函数，函数需要传入一个context即Component实例，它返回求值结果 

  在内部regularjs通过比较get函数两次返回结果的不同判断数据是否变动。


  _example:_
  ```js
  // create expression
  var component = new Regular({
    data: {
      user: 'leeluolee',
      age: 20 
    }
  });

  var expr = component.$expression("user + ':' + (age - 10)")

  alert(expr.get(component) === "leeluolee:10" ) //true

  ```



* __set(context, value)__  *此函数不一定存在

  如果表达式是一个合法的[LeftHandSideExpression](http://es5.github.io/#x11.2)，regular会提取出set函数，用来对表达式代表的字段进行赋值，set函数通常用于实现双向绑定(比如内置的指令r-model就利用了set函数)


  _example_

  ```javascript

  // component as context
  var component = new Regular({
    data: {
      users: [
        {name: 'leeluolee'},
        {name: 'luobo'}
      ],
      index:0
    }
  });

  var expr = component.$expression('users[index].name')

  expr.set(component, 'daluobo');

  alert(component.data.users[0].name === 'daluobo') // true

  ```

  并不是所有表达式都可以提取出set，即代表了不是所有表达式都能完成双向绑定，比如表达式`「a+b」`，显然虽然我们可以获取它的值，但是我们无从知晓如何去设置a和b的值。





### __[&#x27AD;阅读模板文档](http://regularjs.github.io/reference/?syntax-zh)__了解插值语句和功能语句