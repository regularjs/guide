#数据绑定和生命周期

regularjs 推崇极致的数据驱动的组件开发，而其中数据绑定是实现数据驱动的组件开发的核心所在。

regularjs的组件实例中与数据绑定相关的函数有如下几个


<a name="watch"></a>
### 1 `component.$watch(expression, handler)`

绑定一个数据监听器，返回watchid，用于$unwatch(解绑) 


__Arguments__

  * expression [Expression| Array | String] - expression可以有多种参数类型
    - Expression: 每次都会检查此表达式求值是否改变
    - String: 此字符串会先被`Regular.expression`处理为Expression
    - Array: 即检查多个表达式，数组中的任意一个发生改变都触发回调
  * handler(newvalue, oldvalue) [Function] - 监听器回调，传入改变前和改变后的值
    - newvalue:  current value of the Expression
    - oldvalue:  previous value of the Expression


    __注__: 当为多重监听时，参数为所有表达式的新值列表


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


`$update`请参考[$update](#update);



<a name="unwatch"></a>
### 2 `component.$unwatch(watchid)`

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


<a name="update"></a>
### 3 `component.$update(setable, value)`

设值函数，设值之后会进入组件的digest阶段，即脏检查

__Arguments__

  * setable [Expression| Function | String] - expression可以有多种参数类型
    - String: 此字符串会先被Regular.expression处理为Expression
    - Expression: 此expression需要有set函数，[查看Expression](../syntax/expression.md)
    - Function:，类似于angular的$apply，传入setable的参数如下
      - data: 即组件的数据模型`component.data`

  * value - 设置的值，如果expression参数为Function，则被忽略

```javascript

var component = new Regular();

component.$update('a.b', 2); // component.data.a.b = 2;

component.$update('a + b', 1); // !! invalid expression, canot extract set function

component.$update(function(data){ // data == component.data
  data.a.b = 2;
});

// multi $update
component.$update({
  "b": 1,
  "a.b": 100
});


component.$update() // do nothing , just enter digest phase

```

> <h5>Warning: </h5>
> 无论传入什么参数，运行$update之后都会进行组件作用域内的dirty-check

<a name="get"></a>
### 4 `component.$get(expr)`


除了直接操作数据对象`data` 去获取值，你也可以使用`$get`去获取表达式的值，这个相当于angular的`$eval`，__`$get`的出现主要是为了获取[计算属性的值](computed.md)__


__Exmaple__


```javascript
var component = new Regular({
   data: {items: [1,2,3]},
   computed: {
     computedLength: "items.length"
   }
});

component.$get("items.length"); //=== 3
component.$get("computedLength"); //=== 3

```

> 由于为了ie8的支持，你目前无法直接使用data.computedLength的方式来获取计算属性。（不过未来可能会发布一个更友好的版本来去掉ie8-的支持）;




<a name="bind"></a>
### 5 `component.$bind(component2, expr1[, expr2])`

与另一个组件实现双向绑定

__Arguments__
  1. component2<Regular>: 要绑定的组件
  2. expr1 <Expression|String|Object|Array>: 此参数有多种参数类型
    - Expression|String: 本组件要绑定的表达式
    - Object: 同时绑定多个表达式对
    - Array: 表达式列表，同时实现多个同名表达式(即只传入expr1)
  3. expr2 <Expression|String>: 目标组件要绑定的表达式，缺省为expr1

> <h5>WARN</h5>
> 1. 如果两个表达式都是setable的，可实现双向绑定，否则只能实现单向绑定
> 2. 如果连个组件在bind时是不同步的，component2数据会先同步到component


__Example__: 

两个独立的分页器实现数据联动

```javascript // insert var pager = new Pager({data: {total: 100, current:20}}).$inject('#bind1'); var pager2 = new Pager({data: {total: 50, current:2}}).$inject('#bind1'); var pager3 = new Pager({data: {total: 100, current:20}}).$inject('#bind2');
var pager4 = new Pager({data: {total: 50, current:2}}).$inject('#bind2');

var pager5 = new Pager({data: {total: 100, current:2}}).$inject('#bind3');
var pager6 = new Pager({data: {total: 50, current:20}}).$inject('#bind3');


// style 1
pager.$bind(pager2, ['current', 'total']);


// style 2
pager3.$bind(pager4, 'current', 'current')
pager3.$bind(pager4, 'total')

// style 3
pager5.$bind(pager6, {current: "current", total: "total"});


// bind chain
var pager = new Pager({data:{total: 1000, current:1}}).$inject('#bind_chain');
for(var i = 0; i < 10; i++){
  var pager = new Pager({data:{total: 1000, current:1}})
    .$bind(pager, ['total', 'current'])
    .$inject('#bind_chain');
}

```

[|DEMO|](http://fiddle.jshell.net/leeluolee/7wgUf/)

