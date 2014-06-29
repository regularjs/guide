#数据监听和生命周期

数据驱动的思想是mvvm模式中的核心，regular也是如此.

regularjs的组件实例中与数据监听相关的函数有如下几个



<a name="$watch"></a>
### 1 `component.$watch(expression, handler)`

绑定一个数据监听器, 返回watchid，用于$unwatch(解绑) 


__Arguments__

  * expression [Expression| Array | String] - expression可以有多种参数类型
    - Expression: 每次都会检查此表达式求值是否改变
    - String: 此字符串会先被Regular.parse处理为Expression
    - Array: 即检查多个表达式，数组中的任意一个发生改变都触发回调
  * handler(newvalue, oldvalue) [Function] - 监听器回调，传入改变前和改变后的值

    __注__: 当为多重监听时， 参数为所有表达式的新值列表


__Example__

```javascript
var component = new Regular();


var expression = Regular.expression('c + d');
component.$watch(expression, function(nvalue, oldvalue){alert('c + d is changed to' + nvalue );
})

var watchid = component.$watch('a + b', function(nvalue,oldvalue){
  alert('a + b=' + nvalue );
})

component.$watch(['a + b', expression], function(a_add_b, c_add_d){
  alert('a + b, c + d is changed' );
})


component.$update(function(data){
  data.a = 1;
  data.b = 4;
  data.c = 1;
  data.d = 4;
})

```


`$update`请参考[$update](#$update);



<a name="$unwatch"></a>
### 2 $unwatch(watchid)

取消一个数据监听器 

__Arguments__

  * watchid [Number] - `$watch`返回的watchid


__Example__


```javascript

var component = new Regular();

component.$watch('b', function(b){
  alert('b watcher 1');
})

var id = component.$watch('b', function(){
  alert('b watcher 2');
})

component.$unwatch(id);
component.$update('b', 100); // only watcher 1 alert;

```


<a name="$update"></a>
### 3 `$update(setable, value)`

设值函数, 设值之后会进入组件的digest阶段，即脏检查

__Arguments__

  * setable [Expression| Function | String] - expression可以有多种参数类型
    - String: 此字符串会先被Regular.expression处理为Expression
    - Expression: 此expression需要有set函数, [查看Expression](../syntax/expression.md)
    - Function: , 类似于angular的$apply,  传入setable的参数如下
      - data: 即组件的数据模型`component.data`

  * value - 设置的值，如果expression参数为Function，则被忽略

```javascript

var component = new Regular();

component.$update('a.b', 2); // component.data.a.b = 2;

component.$update('a + b', 1); // !! invalid expression, canot extract set function

component.$update(function(data){ // data == component.data
  data.a.b = 2;
});

component.$update() // do nothing , just enter digest phase

```

> <h5>Warning: </h5>
> 无论传入什么参数，运行$update之后都会进行组件作用域内的dirty-check

<a name="$bind"></a>
### 2.5 `$bind(component, expr1[, expr2])`

与另一个组件实现双向绑定

__Arguments__
  1. component<Regular>: 要绑定的组件
  2. expr1 <Expression|String|Object|Array>: 此参数有多种参数类型
    - Expression|String: 本组件要绑定的表达式
    - Object: 同时绑定多个表达式对
    - Array: 表达式列表,同时实现多个同名表达式(即只传入expr1)
  3. expr2 <Expression|String>: 目标组件要绑定的表达式, 缺省为expr1

> 注意如果两个表达式都是setable的，可实现双向绑定，否则只能实现单向绑定

__Example__: 

两个独立的分页器实现数据联动

```javascript

var pager = new Pager({data: {total: 100, current:20}}).inject('#app');
var pager2 = new Pager({data: {total: 100, current:20}}).inject('#app');

// create binding 
pager.$bind(pager2, ['current', 'total']);


// it is equal with 
// pager.$bind(pager2, 'current')
// pager.$bind(pager2, 'total')

```

[|DEMO|]()


你也可以绑定不一致的表达式

```
```




> regularjs中对于一些不希望开发者覆写的方法名都做了`$`前缀标记.这些函数有`$watch`


