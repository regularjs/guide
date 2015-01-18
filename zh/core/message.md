#事件发射器

regular提供了简单的事件发射器支持，与angular类似提供了`$on` `$off` 以及`$emit`

##接口描述

<a name="message"></a>

1. `component.$on(String name,Function handler)`
  - name 事件类型
  - handler 事件处理函数，接受的参数即传入(#emit)的参数
2. `component.$off(String name, Function handler)`: 解绑事件监听
  + name : event name, if missed, will remove all watcher in this component
  + handler : if missed, will remove all  watcher have the same event_name
3. `component.$emit(String name, args..)`: 发射对应的事件类型
  + name : 事件类型
  + args : 所有传入的参数都会传入监听回调中

> 如果传入`$on`的是Object型，将视为多重绑定

__Example__


```javascript
var component = new Regular();

var clickhandler1 = function(arg1){ console.log('clickhandler1:' + arg1)}
var clickhandler2 = function(arg1){ console.log('clickhandler2:' + arg1)}
var clickhandler3 = function(arg1){ console.log('clickhandler3:' + arg1)}

component.$on('hello', clickhandler1);
component.$on('hello', clickhandler2);
component.$on({ 
  'other': clickhandler3 
});


component.$emit('hello', 1); // handler1 handler2 trigger

component.$off('hello', clickhandler1) // hello: handler1 removed

component.$emit('hello', 2); // handler1 handler2 trigger

component.$off('hello') // all hello handler removed

component.$off() // all component's handler removed

component.$emit('other');


```
