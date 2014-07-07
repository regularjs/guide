# Expression

Expression is the heart of  template and watcher-system.


<a name="expression"></a>
you can also use `Regular.expression` to create an expression at runtime.


A Expression object have two important part:

* __get(context)__

  the getter of the expression, you need pass a component to it as the context. 

  it return the expression's evaluated value. in [watcher-system](../core/binding.md), regularjs use getter to find whether the data is changed.


  _example:_
  ```js
  // create expression
  var expr = Regular.expression("user + ':' + (age - 10)")

  // component as context
  var component = new Regular({data: {user: "leeluolee", age: 20}});

  alert(expr.get(component) === "leeluolee:10" ) //true

  ```


* __set(context, value)__ 

  if the expression is a valid [LeftHandSideExpression](http://es5.github.io/#x11.2), the set method will exsit. the method is used to do setter function on the expression.

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




