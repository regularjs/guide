# 语法组成

从语法层面讲, regular模板中有两个环境. 


## 1. xml

xml的组成就如我们平时所知的html


## 2. jst

jst即被开标签(默认为`{{`)和闭标签(默认为`}}`)包裹的部分

为什么没有沿用mustache的简化语法？因为要引入表达式的支持，并且后续的规则扩展就无需去找类似`^` `!`之类的符号了

与xml一样 一个jst rule的标签的开标签与闭合标签必须匹配,比如`{{#list}}`必须匹配`{{/list}}`, 而有有些标签允许自闭合如`{{#include}}` 这些其实更接近于java中的freemarker模板.


# 表达式

从上面几节我们可以了解到，表达式是整个模板系统的核心(并且也是整个数据-ui更新体系的核心)

regular支持的表达式几乎与angular相一致，与angular不同的是， regular最终parse后的结果是一个function body，而不是angular中嵌套的闭包，这样可以使得解析结果可以被序列化和传递.

比如`{{user.id|lowercase}}`在parse后获得的数据结构是


```js
{
  "type": "expression",
  "body": "(function(){var _f_=_d_['user']['id'];_f_ = _c_._f('lowercase')(_f_);return _f_})()",
  "constant": false,
  "setbody": false
}
```

其中`body`与`setbody`在compile阶段会用`new Function`生成函数

你可以通过`Regular.expression`在运行时创建一个可运行的expression. expression包含两个个部分


* __get(context)__

  即这个表达式的求职函数, 函数需要传入一个context, context即一个Regular组件的实例,返回求值结果, regularjs通过比较get函数两次返回结果的不同判断数据是否变动.

  _example:_
  ```js
  // create expression
  var expr = Regular.expression("user + ':' + (age - 10)")

  // component as context
  var component = new Regular({data: {user: "leeluolee", age: 20}});

  alert(expr.get(component) === "leeluolee:10" ) //true

  ```



* __set(context, value)__  此函数不一定存在

  如果表达式是一个合法的[LeftHandSideExpression](http://es5.github.io/#x11.2), regular会提取出set函数, 用来对表达式代表的字段进行赋值, set函数通常用于实现双向绑定(比如内置的指令r-model就利用了set函数)

  _example_

  ```javascript
  var expr = Regular.expression("user.name")

  // component as context
  var component = new Regular({
  data: {
    user:{
      name: 'leeluolee'
    }
  }});

  expr.set(component, 'daluobo');

  alert(component.data.user.name === 'daluobo') // true

  ```

使用表达式的几个注意要点

1. regular 不支持自增、自减(`++`,`--`)以及位操作符`&` `|`等
2. 表达式中的this指向传入的context本身, 所以你可以通过`this.xx`来调用组件的某个方法
3. regular中数据的根路径从context.data开始, 即`user` 其实获取的是`context.data.user`
4. regular中开放了以下js中的全局关键字代表的对象的直接使用:
  `true` `false` `undefined` `null` `Array` `Date` `JSON` `Math` `NaN` `RegExp` `decodeURI` `decodeURIComponent` `encodeURI` `encodeURIComponent` `parseFloat` `parseInt` `Object` `String`


