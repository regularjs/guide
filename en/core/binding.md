#Data-binding and Life-cycle

Data-binding is the core to realize the data-driven component. in regularjs, data-binding is based on watcher system. there are some methods which is important in this system

<a name="watch"></a>
### 1 `component.$watch(expression, handler)`

create a watcher , and return a watchid that used for `$unwatch`.


__Arguments__

  * expression [Expression| Array | String] - 
    - Expression: 
    - String: will be preprocessed by `Regular.expression` to become `Expression`
    - Array: any Expression changed in Array, will trigger the watcher. the params passed to handler is the current values of all item in Array.
  * handler(newvalue, oldvalue) [Function]
    - newvalue:  current value of the Expression
    - oldvalue:  previous value of the Expression



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


you can find the explanation of `$update` [at here](#update);



<a name="unwatch"></a>
### 2 `component.$unwatch(watchid)`

remove a watcher.

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

<a name="bind"></a>
### 2.5 `component.$bind(component2, expr1[, expr2])`

与另一个组件实现双向绑定

__Arguments__
  1. component2<Regular>: 要绑定的组件
  2. expr1 <Expression|String|Object|Array>: 此参数有多种参数类型
    - Expression|String: 本组件要绑定的表达式
    - Object: 同时绑定多个表达式对
    - Array: 表达式列表,同时实现多个同名表达式(即只传入expr1)
  3. expr2 <Expression|String>: 目标组件要绑定的表达式, 缺省为expr1

> <h5>WARN</h5>
> 1. 如果两个表达式都是setable的，可实现双向绑定，否则只能实现单向绑定
> 2. 如果连个组件在bind时是不同步的，component2数据会先同步到component


__Example__: 

两个独立的分页器实现数据联动

```javascript

 // insert
var pager = new Pager({data: {total: 100, current:20}}).inject('#bind1');
var pager2 = new Pager({data: {total: 50, current:2}}).inject('#bind1');

var pager3 = new Pager({data: {total: 100, current:20}}).inject('#bind2');
var pager4 = new Pager({data: {total: 50, current:2}}).inject('#bind2');

var pager5 = new Pager({data: {total: 100, current:2}}).inject('#bind3');
var pager6 = new Pager({data: {total: 50, current:20}}).inject('#bind3');


// style 1
pager.$bind(pager2, ['current', 'total']);


// style 2
pager3.$bind(pager4, 'current', 'current')
pager3.$bind(pager4, 'total')

// style 3
pager5.$bind(pager6, {current: "current", total: "total"});


// bind chain
var pager = new Pager({data:{total: 1000, current:1}}).inject('#bind_chain');
for(var i = 0; i < 10; i++){
  var pager = new Pager({data:{total: 1000, current:1}})
    .$bind(pager, ['total', 'current'])
    .inject('#bind_chain');
}

```

[|DEMO|](http://fiddle.jshell.net/leeluolee/7wgUf/)

其中pager的实现在[这里](https://rawgit.com/regularjs/regular/master/example/pager/pager.js)

>[内嵌组件](../advanced/component.md)与外层的数据绑定就是通过`$bind`实现的





