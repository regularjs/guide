
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

<a name="expression"></a>
你可以通过`Regular.expression`在运行时创建一个可运行的expression. 它包含两个个部分




* __get(context)__

  即这个表达式的求值函数, 函数需要传入一个context即Component实例 它返回求值结果 

  在内部regularjs通过比较get函数两次返回结果的不同判断数据是否变动.


  _example:_
  ```js
  // create expression
  var expr = Regular.expression("user + ':' + (age - 10)")

  // component as context
  var component = new Regular({data: {user: "leeluolee", age: 20}});

  alert(expr.get(component) === "leeluolee:10" ) //true

  ```



* __set(context, value)__  *此函数不一定存在

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

1. __表达式中的`this`指向传入的context本身, 所以你可以通过`this.xx`来调用组件的某个方法__
2. __regular中数据的根路径从context.data开始, 即`user` 其实获取的是`context.data.user`__
3. regular 不支持自增、自减(`++`,`--`)以及位操作符`&` `|`等
4. regular中开放了以下js中的全局关键字代表的对象的直接使用:
  
  true false undefined null Array Date JSON Math NaN RegExp decodeURI decodeURIComponent encodeURI encodeURIComponent parseFloat parseInt Object String


## 创建只运行一次的表达式(bind-once)

由于脏检查机制的性能极大的依赖于监听器的数量，为了精确控制监听器的数量，regularjs引入了一个新的表达式语法元素`@()`提供了bind-once的表达式的支持. 这个被监听的表达式在检查到一次值变化就会被接触监听。 


你可以使用`@()`在任何使用到Expression的地方，例如`if`, `list`, `include`, `{{}}`等 


__Example__

```html
<div>{{ @(title) }}</div> // the interpolation only work once

{{#if @(test)}}  // the if rule is evaluated once
//...
{{/if}}

{{#list @(items) as item}}  // the list rule is evaluated once
//...
{{/list}}

```

你也可以在`$watch` 使用 `@()`(因为在regularjs中，这事实上就是个合法的语法元素，所以任何可以传入表达式的地方都可以使用它)

```javascript

var component = new Regular({
  data: {
    user: {}
  }
});

var i = 0;
component.$watch("@(user.name)", function(){
    i++  // only trigger once
});
component.$update("user.name", 1);
component.$update("user.name", 2);

// update twice  but trigger once
alert(i === 1);
```


就如上的例子所示，由于`脏了一次就被被抛弃`, 如果值后续继续变化，会导致ui与data的不同步，所以特别是处女情节的小伙伴要小心使用。 




> ##  当表达式无法满足你时，你可能需要[计算属性](../core/computed.md)