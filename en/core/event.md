# Event System

Every attribute prefixed with `on-` will be considered as event binding.

> <h5>tip</h5>
> In fact, event is a special directive. beacuse the directive accepts RegExp as the first param.



## 1. Basic Event Support
  
you can binding event-handler with `on-xxx` attribute on tag (e.g.  `on-click` `on-mouseover`)

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


## 4. Proxy or Evaluate.

Expreesion and Non-Expression is all valid to handle the event. but they do different this when event  be triggered.

1. Expression(e.g. `on-click={{this.remove()}}`)
  once the event fires. Expression will be evalutated, it is similar with angular.

  __Example__
  

  ```html
    <div on-click={{this.remove(index)}}>Delte</div>
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



<a name="$event"></a>
## 4. `$event`

In some cases, you may need the `Event` object, regularjs created an temporary variable`$event` for it, you can use the variable in the Expression. 

if the event is custom event, the `$event` is the param you passed in `fire`.

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


-----------

Description

|Param|Type|Details|
|---|---|---|
|on-*(e.g.`on-mouseover`)|`expression` or `no-expression`| `Expression` to evaluate upon specified event be triggered,Event object is available as `$event` <br> `Non-Expression` be proxied to specified event upon the event fire.  |



