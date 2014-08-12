#EventEmitter

regularjs provides simple EventEmitter for Component.

##API

<a name="message"></a>

1. `component.$on([String|Object] name,Function handler)`  add listener
  - name: event name
  - handler: the event handler
2. `component.$off(String name, Function handler)`: remove listener 
  + name : event name, if missed, will remove all watcher in this component
  + handler : if missed, will remove all  watcher have the same event_name
3. `component.$emit(String name, args..)`: trigger event
  + name : event name
  + args : the args passed to the handler


__Example__


```javascript
var component = new Regular();

var clickhandler1 = function(arg1){ console.log('clickhandler1:' + arg1)}
var clickhandler2 = function(arg1){ console.log('clickhandler2:' + arg1)}
var clickhandler3 = function(arg1){ console.log('clickhandler3:' + arg1)}

component.$on('hello', clickhandler1);
component.$on('hello', clickhandler2);
component.$on({ 
  'other': clickhandler3  // mulitply $on
});


component.$emit('hello', 1); // handler1 handler2 trigger

component.$off('hello', clickhandler1) // hello: handler1 removed

component.$emit('hello', 2); // handler1 handler2 trigger

component.$off('hello') // all hello handler removed

component.$off() // all component's handler removed

component.$emit('other');


```
