# 表达式 


## ES5 表达式

Regular 支持几乎所有 ES5 表达式语法，下列都是合法的表达式


- `100 + 'b'`.
- `user? 'login': 'logout'`
- `title = title + '1'`
- `!isLogin && this.login()`
- `items[index][this.nav(item.index)].method1()`


__几个注意点__

1. __表达式中的`this`指向组件本身__
2. __数据根路径从 `component.data` 开始, 即`user` 其实获取的是`component.data.user`__
3. 不支持自增、自减(`++`,`--`)以及位操作符`&` `|`等
4. 不支持正则表达式的字面量
5. 开放了部分JS内建对象:
  - Array Date JSON Math NaN RegExp Object String
  - decodeURI decodeURIComponent encodeURI encodeURIComponent 
  - parseFloat parseInt 


除了 ES5 的表达式，Regular 还提供了以下几种表达式类型


## 规范外表达式类型

###  一次性绑定 {#bind-once}


脏检查性能依赖于监听器的数量，Regular引入了`@()`预发提供了一次绑定功能： 监听器在一次变更后就会被移除。 


__syntax__

`@(Expression)`

> 可以在任意的表达式环境使用`@()`(`list`, `if`... etc)


__Example__

```html
<div>{ @(title) }</div> // the interpolation only trigger once

{#if @(test)}  // only test once
//...
{/if}

{#list @(items) as item}  // only trigger once
//...
{/list}

```


- 你也可以在`$watch` 使用 `@()`

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


如上例所示，由于『脏了一次就被被抛弃』, 如果值后续继续变化，会导致UI与数据不同步。


### 过滤器Filter {#filter}

__syntax__

`Expression| fitlerName: arg1, arg2,... argN `


__Example__

假设已注册 `format` 过滤器

```html
<div>{list|format: 'yy-MM-dd'}</div>
```


__参考指南__


- [过滤器](../basic/filter.md)




###  Range {#range}

Range 即数组的简写模式

__Syntax__: 

` start..end `


__Example__

`1..3 === [1,2,3]`


##  错误抑制

在动态模板中，如果抛出所有JS中常见的 `xx of undefined` 的错误，整个系统会变得相当脆弱。Regular 抑制了这类错误中安全的部分，并使用undefined代替


```js

new Regular({
  template: "<div>{blog.user.name}</div>"
})

// => <div></div>

```


如果是方法不存在产生的错误，Regular 仍然会抛出，这属于「非安全」的错误

```js

new Regular({
  template: "<div>{this.methodNoFound(blog.user.name)}</div>"
})

```


<script async src="//jsfiddle.net/leeluolee/xb1Lovc9/embed/js,result/"></script>

其中`blog.user.name`错误被抑制，而`this.methodNoFound`的未定义错误会被抛出

## 表达式对象 {#setable}

> 理解表达式对象，可以帮助你使用表达式

表达式在编译后会通过`new Function`编译为一个 __表达式对象__ ，对象包含以下两个关键方法

* __get(context)__

  即表达式的求值函数，函数需要传入context(Component实例)参数

  > Regular的脏检查即通过比较get两次返回是否不同来判断数据是否变动。

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

  如果表达式是一个合法的[LeftHandSideExpression](http://es5.github.io/#x11.2)，Regular会提取set函数，用来赋值，set函数通常用于实现双向绑定。

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


  可以提取出`set`函数的表达式，我们称此表达式是 __setable__ 的，如果一个不是__setable__的表达式应用与双向绑定(如 [r-model](../basic/directive.md#))结合使用，将不能得到应有效果。

> 并不是所有表达式都可以提取出set，即代表了不是所有表达式都能完成双向绑定，比如表达式`「a+b」`，显然虽然我们可以获取它的值，但是我们无从知晓如何去设置a和b的值。



## 表达式的可用场景 {#case}

文档中，标记为`Expression`类型的场景都可以使用表达式。


- [插值](../basic/interpolation.md)
- [语句](../basic/statement.md)
  - [if](../basic/statement/if.md)
  - [list](../basic/statement/list.md)
  - [include](../basic/statement/include.md)
- 允许传入`Expression`的某些API如
  - [$watch](./api.md#watch)
  - [$update](./api.md#update)
  - [$expression](./api.md#expression)






