#Data-binding and Life-cycle

Data-binding is the core to realize data-driven component. In regularjs, data-binding is based on watcher system. there are some methods which are important in this system:

<a name="watch"></a>
### 1 `component.$watch(expression, handler)`

create a watcher, return a watchid that can be used for `$unwatch`.


__Arguments__

  * expression [Expression| Array | String]
    - Expression: real `Expression` object
    - String: will be preprocessed by `Regular.expression` to become `Expression`
    - Array: array of Expression or String. Any Expression changed in the Array will trigger the watcher. the params passed to handler is the current value of all items in Array.
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

  * watchid [Number] - watchid returned by `$watch`


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

do the setter operation on the passed Expression, then enter the `digest` phase.

__Arguments__

  * setable [Expression| Function | String] -
    - Expression: The Expression must be setable, see more in [Expression](../syntax/expression.md)
    - String: String will be passed to Expression
    - Function setable(data): just like angular's `$apply`, you can batch update-operation in one passed handler
      - data: equal to component.data
    - Object: multiple setting operation.

  * value - value assigned to the field pointed by the Expression `setable`. if `setable` is a Function, it will be ignored.

```javascript

var component = new Regular({
  data: {
    a: {}
  }
});

component.$update('a.b', 2); // component.data.a.b = 2;

component.$update('a + b', 1); // !! invalid expression, canot extract set function

component.$update({
  b: 1,
  c: 2
}) // multiply setter

component.$update(function(data){ // data == component.data
  data.a.b = 2;
});

component.$update() // do nothing , just enter digest phase

```

> <h5>Warning: </h5>
> whatever param you passed, the digest phase will always be triggered.

<a name="$mute"></a>
### 4. `component.$mute(disable)`

you can disable a component to forbid it doing dirty-check. in most case, you will combine it with [`$inject(false)`](../getting-start/quirk-example.html#$inject) to remove it from document and make it disable 

__Arguments__

- disable[Boolean] : if true, the component will stop dirty-check (even if you call $update). if disable is false, component will return dirty-check.


```js
// remove component from document, and disable it.

component.$mute(true).$inject(false);

```

<a name="get"></a>
### 4 `component.$get(expr)`

Instated of using `data.*` to access property directly, you can also pass a `Expression` to get the evaluated value.

__Exmaple__


```javascript
var component = new Regular();

component.$get("items.length");
component.$get("computedProperty")

```

__you can use `$get`  to get the [computed property](computed.md)__. 

it is beacuse that `DefineProperty` is not available at `ie9-` which is also regularjs's [target browser](../introduct/target.md). so if you use `component.data.compute1` to get computedProperty, it will be fail( we may release another version to remove the ie8- support , then regularjs can totally switch to `defineProperty`);


<a name="bind"></a>
### 5 `component.$bind(component2, expr1[, expr2])`

create binding with another component.

__Arguments__

  1. component2<Regular>: the target component you need to bind
  2. expr1 <Expression|String|Object|Array>:
    - Expression|String: the field that component need to bind
    - Object: you can bind multiple fields at the same time, the key represents component's field, the value represents target's field.
    - Array: create multiple fields between component and component2 with the same field
  3. expr2 <Expression|String>: the target component's  filed you need to binding. the default is expr1.

> <h5>WARN</h5>
> 1. There is at least one Expression that is setable. If all components are setable, it is two-way binding. otherwise, it will be a one-way binding.
> 2. If target-component is not synchronous with component, it will be synchronized to called-component immediately.


__Example__:

create binding between two independant pager components.

```javascript

 // insert
var pager = new Pager( {data: {total: 100, current:20}} ).$inject('#bind1');
var pager2 = new Pager( {data: {total: 50, current:2}} ).$inject('#bind1');

var pager3 = new Pager({data: {total: 100, current:20} }).$inject('#bind2');
var pager4 = new Pager({data: {total: 50, current:2}}).$inject('#bind2');

var pager5 = new Pager({data: {total: 100, current:2}}).$inject('#bind3');
var pager6 = new Pager({data: {total: 50, current:20}}).$inject('#bind3');


// style 1
pager.$bind(pager2, ['current', 'total']);


// style 2
pager3.$bind(pager4, 'current', 'current')
pager3.$bind(pager4, 'total') // the same as pager3.$bind(pager4, 'total', 'total')

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

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/7wgUf/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

you may need [the sourcecode of  the pager ](https://rawgit.com/regularjs/regular/master/example/pager/pager.js)






