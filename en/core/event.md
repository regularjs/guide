# event——ui事件体系

Every attribute prefixed with `on-` will be considered as event binding.

> <h5>tip</h5>
> In fact, event is a special directive. beacuse of the 



## 1. Basic Event Support
  
  you can binding event-handler with `on-xxx` attribute on tag (e.g.  `on-click` `on-mouseover`)
  . everytime the event is be triggered, the value of the attribute will be evaluted.

  __Example__:

  ```javascript
  new Regular({
    template: 
    "<button on-click={{count = count + 1}}> count+1 </button> \
      <b>{{count}}</b>",
    data: {count:1}
  }).inject(document.body);
  ```

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/y8PHE/1/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>




## 2. Register Custom Event `Component.event(event, fn)`

you may need to register a custom event that is not native supported by the browser(e.g. `on-tap` `on-enter`).

__Arguments__
  * event: the name of custom event
  * fn(elem, fire)   the definition of the custom event
    -elem   attached element
    -fire   the trigger of the custom event. when fire is called with some __param__, the passed Expreesion  will be Evaluated. and the __param__ will become the [`$event`](#$event).


> <h5>Tips</h5>
> * if you need some teardown job, you need return a function.


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



<a name="$event"></a>
## 3. `$event`

In regularjs , the event is processed in declarative way. But in some cases, you may need the `Event`Object, regularjs created an temporary variable`$event` for it, you can use the variable in the Expression. 

when the event is custom event, the `$event` is the param you passed in `fire`.

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

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/y8PHE/5/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

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



