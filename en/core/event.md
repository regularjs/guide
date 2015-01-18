# Event System

Every attribute prefixed with `on-` (e.g `on-click`) will be considered as event binding. you can also use it in delegating way via `delegate-*` (e.g. `delegate-click`)

> <h5>tip</h5>
> In fact, event is a special directive, for it accepts RegExp as the first param.



## 1. Basic Event Support

you can bind event-handler with `on-xxx` attribute on tag (e.g.  `on-click` `on-mouseover`)

  __Example__:

  ```javascript
  new Regular({
    template:
    "<button on-click={count = count + 1}> count+1 </button> \
      <b>{count}</b>",
    data: {count:1}
  }).$inject(document.body);
  ```

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/y8PHE/1/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>




<a name="custom-event"></a>
## 2. Register Custom Event `Component.event(event, fn)`

You can register a custom event which is not native supported by the browser(e.g. `on-tap` `on-enter`).

__Arguments__
  * event: the name of custom event
  * fn(elem, fire)
    -elem   attached element
    -fire   the trigger of the custom event.

> <h5>Tips</h5>
> * if you need some teardown work, you need return a function.


__Example__


the source of the builtin event —— `on-enter`

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


## 3. Proxy or Evaluate.

Expreesion and Non-Expression is all valid to handle the event. but they do different this when event  be triggered.

1. Expression(e.g. `on-click={this.remove()}`)
  once the event fires. Expression will be evalutated, it is similar with angular.

  __Example__


  ```html
    <div on-click={this.remove(index)}>Delte</div>
  ```


2. Non-Expression (e.g. `on-click="remove"`)
   event be proxied to specified event(`remove` above) upon the event fire. you can use `$on` to handle it. it is similar with ractive.

  __Example__

  ```html
    <div on-click="remove">Delte</div>
  ```

  then handle the proxy event with `$on`


  ```javascript
  var Component = Regular.extend({
    template:'#example',
    init: function(){
      this.$on("remove", function($event){
          // your logic here
      })
    }
  })

  ```


once event fires, the digest phase will be triggered.__ you dont need to `$update` in your handle __.


## 4. Delegate Event by `delegate-*`

every `on-*` will call `addEventListener` on element.  sometimes, it is not efficient.

you can use `delegate-` insteadof `on-` to avoid the potential performance issue. regularjs will attach single event on component's parentNode(when `$inject` is called), all delegating-event that defined in component will be processed collectively.

From user perspective, `on-` and `delegate-` is almost the same.

__Example__

```html
<div delegate-click="remove">Delte</div>   //Proxy way via delegate
<div delegate-click={this.remove()}>Delte</div> // Evaluated way via delagate
```

__Warning__

1. if the component is large in structure. avoid attaching too much events that is `frequencey triggered` (e.g. mouseover) to component.
2. if the event is a [custom event](#custom-event). it need to have the ability to bubble, then the component.parentNode can capture the event. for exampel:  zepto's tap-event [source](https://github.com/madrobby/zepto/blob/master/src/event.js#L274).

<a name="$event"></a>
## 5. `$event`

In some cases, you may need the `Event` object, regularjs created an temporary variable`$event` for it, you can use the variable in the Expression.

if the event is custom event, the `$event` is the param you passed in `fire`.

__Example__

```javascript
new Regular({
  template:
  "<button on-click={this.add(1, $event)}> count+1 </button> \
    <b>{count}</b>",
  data: {count:1}
  add: function(count, $event){
    this.data.count += count;
    alert($event.pageX)
  }
}).$inject(document.body);
```


> <h5>Tip</h5>
> `$event` is fixed for you already, you can use the property below.
> 1. target
> 2. preventDefault()
> 3. stopPropgation
> 4. which
> 5. pageX
> 6. pageY
> 7. wheelDelta
> 8. $event.event will get the origin event.


//@TODO



## Other Useful  Tips

### 1. you can  bind multiple events with same type on single element.

  beacuse regularjs is string-based template. you can having same attributes on one element.

### 2. avoid to bind frequently triggered event(e.g. `mouseover` `scroll`)  via `delegate-*`

  just like `jQuery.delegate` . frequently triggered event is expensive when used with delegate-style.

### 3. you can use `if` to attach or detach event on element

  ```html
  <input {#if test===0 } on-click={test = 1} {/if} />
  ```


-----------



