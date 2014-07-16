# Expression

Expression is the heart of  template and watcher-system.


<a name="expression"></a>
you can also use `Regular.expression` to create an expression at runtime.


A Expression object have two important part:

* __get(context)__

  the getter of the expression, you need pass a component to it as the context. 

  it return the expression's evaluated value. in [watcher-system](../core/binding.md), regularjs use getter to determine whether the data is changed.


  _example:_
  ```js
  // create expression
  var expr = Regular.expression("user + ':' + (age - 10)")

  // component as context
  var component = new Regular({data: {user: "leeluolee", age: 20}});

  alert(expr.get(component) === "leeluolee:10" ) //true

  ```


* __set(context, value)__ 

  if the expression is a valid [LeftHandSideExpression](http://es5.github.io/#x11.2), the set method will exsit. the method is used as setter for the field the expression represents.

  > the `set` is useful in duplex data-binding like [r-model](../core/directive.html#1-r-model-)

__example__

  ```javascript
  var expr = Regular.expression("user.name")

  // component as context
  var component = new Regular({
  data: {
    user:{
      name: 'leeluolee'
    }
  }});

  expr.set(component, 'daluobo');

  alert(component.data.user.name === 'daluobo') // true

  ```

  __Tips__

  1. `this` point to the context.
  2. the root of the data is context.data. so `user` in Expression is means 'context.data.user'
  3. regular dont supoort prefix,postfix and bitwise operation(e.g. `++`,`--`, `&`)
  4. you can directly use some global Object like:
    
    true false undefined null Array Date JSON Math NaN RegExp decodeURI decodeURIComponent encodeURI encodeURIComponent parseFloat parseInt Object String


## Expression only binding-once

Beacuse the dirty-check's performance is tightly related to the number of the binding. so the less binding is created the better .

in regularjs you can wrap your Expression with `@(Expression)` to  make the Expression only __trigger once__. 

__Example__

```html
<div>{{ @(title) }}</div> // the interpolation only work once

{{#if @(test)}}  // the if rule is evaluated once
//...
{{/if}}

{{#list @(items) as item}}  // the list rule is evaluated once
//...
{{/list}}

```

you can also use `@()`  in `$watch`

```javascript

var component = new Regular({
  data: {
    user: {}
  }
});

var i = 0;
component.$watch("@(user.name)", function(){
    i++  // only trigger once
});
component.$update("user.name", 1);
component.$update("user.name", 2);

// update twice  but trigger once
alert(i === 1);
```

As shown above, binding-once __may make the data isn't synchronized with the ui__. you should use it be carefull.


###how `@()` make the Expression triggered once?

 1. `@()` will make the Expression with the flag __once__
 2. when $watch find the Expression with __once__ flat. it will create a watcher with the __once__ flat.
 3. in digest phase. if the once-marked watcher is be found dirty, after the watcher update, it will be auto removed.
 4. next digest phase will not check the watcher

> if Expression is be determined to constant(e.g. `1+1` `10 > 1`), the watcher also will have the __once__ tag.

