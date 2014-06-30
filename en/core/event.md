# event——ui事件体系

所有的`on-`开头的属性都会被作为ui事件处理

> <h5>tip</h5>
> 由于Component.directive支持正则匹配属性名, 所以内部实现中ui事件绑定其实是一种特殊的指令



## 1. 对于未自定义过的ui事件
  与ractive类似, 事件指令会默认在指令所在节点绑定对应事件，比如`on-click={{this.add()}}`会在节点绑定`click`事件。与ractive不同的是，每次ui事件触发时，regularjs不是以代理的形式，而是与angular一样，运行一次绑定的表达式.

  即所有dom中的click、change、keydown等事件都可以直接on-xx的方式进行绑定

  __Example__:

  ```javascript
  new Regular({
    template: 
    "<button on-click={{count = count + 1}}> count+1 </button> \
      <b>{{count}}</b>",
    data: {count:1}
  }).inject(document.body);
  ```

  [|DEMO|](http://jsfiddle.net/leeluolee/y8PHE/1/)


## 2. 注册自定义事件 `Component.event(event, handler)`

handler接受两个参数:

  -elem   attached element
  -fire   一个函数，每当这个函数调用，将会触发这个自定义事件，传入fire的参数则会作为[`$event`](#$event)对象

注意如果需要做 __销毁工作__ ，与指令一样，你需要返回一个销毁函数

> 当不传入spec时, event是一个getter方法，用于获取事件处理定义


__Example__ 

Regular内置的on-enter的实现，它在敲击回车时会进行触发


```javascript

  Regular.event('enter', function(elem, fire){
    function update(ev){
      if(ev.which == 13){ 
        ev.preventDefault();
        fire(ev); // if key is enter , we fire the event;
      }
    }
    dom.on(elem, "keypress", update);
    return function destroy(){ // return a destroy function
      dom.off(elem, "keypress", update);
    }
  });
```

注意这里我们返回了一个destroy函数用来清理此ui事件绑定


<a name="$event"></a>
## 3. 事件对象`$event`

Regular推崇的是声明式的事件处理，一般不建议操作事件对象，如果你确实需要. 那你可以使用`$event` 这个临时变量，它会在每次事件触发时注册在作用域上，对于非自定义事件，则`$event`传入fire的对象.

__Example__

```javascript
new Regular({
  template: 
  "<button on-click={{this.add(1, $event)}}> count+1 </button> \
    <b>{{count}}</b>",
  data: {count:1}
  add: function(count, $event){
    this.data.count += count;
    alert($event.pageX)
  }
}).inject(document.body);
```

[|DEMO|](http://jsfiddle.net/leeluolee/y8PHE/3/)


> <h5>Tip</h5>
> `$event`对象是被修正过的，在兼容IE6的前提下，你可以使用以下规范内的属性
> 1. target
> 2. preventDefault()
> 3. stopPropgation
> 4. which 
> 5. pageX
> 6. pageY
> 7. wheelDelta

