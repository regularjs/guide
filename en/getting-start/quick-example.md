
#Quick Example

In this Page, we will create our first component —— __HelloRegular__ . It is used to show an welcome message for people who login. if people aren't login yet, the component will prompt an window. For simplicity, only username is required during the login operation.



## 1. initialize template

```html
<div id="app"></div>

<script id="hello" type="text/regular" name="hello">
  Hello, Guest
</script>

<!-- include regular.js -->
<script src="https://rawgit.com/regularjs/regular/master/dist/regular.js"></script>


<script>
// Create Your First Component
var HelloRegular = Regular.extend({
  template: '#hello'
});

// initialize component then $inject to #app's  bottom
var component = new HelloRegular({
  data: {username: "leeluolee"}
});
component.$inject('#app');
</script>

```

__RESULT__


<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/C2Gh9/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>



* __`Regular.extend`__

  Regular.extend will create a Component extended from Regular.

* `template`

  a Component may need template to describe its structure.

* `data`

  component's model, but it is just a Plain Object.  the `data` passed to `new Component` and the `data` passed to `Component.extend` are merged.

<a name="$inject"></a>
* `$inject(node[, direction])`

  it is an instance method, $inject the component to the position indicated by the parameter 'direction'.
    * `bottom`[default option]: $injected as node's lastChild
    * `top`: $injected as node' s firstChild,
    * `after`: $injected as node' s nextSibling,
    * `before`: $injected as node' s prevSibling,






## 2. Using __interpolation__ to show user's name

This component only shows static message until now, we should make it living by using __interpolation__.


```html
  Hello, {username}
```

__RESULT__

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/C2Gh9/8/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


## 3. using `if/else` to show other message if the user is not logged in


```xml
{#if username}
  Hello, {username}.
{#else}
  Sorry, Guest.
{/if}
```

it just like we use the other string-based template.


__RESULT__

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/C2Gh9/9/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>




## 4. Implement the `Login/Logout`  by event

In this step , we need to add two event to deal with the __Login__ and __Logout__ operation.

```html
{#if username}
  Hello, {username}. <a href="#" on-click={username = ''}>Logout</a>
{#else}
  Sorry, Guest. Please <a hreaf="#" on-click={this.login()}>Login</a>
{/if}

```

> <h5>Tips</h5>

>in regular,  the `on-` prefixed attribute will be considered as [ui event](../core/event.md)
> you can also define your custom event like(e.g. `on-hold` or `on-tap`) and determine when to trigger it;


we add two operation in the template above:


__Login__: the keyword `this` in the template just point to the `component` itself. so we need to add a method named __login__ at HelloRegular's prototype .

__Logout__: the model's root in template points to `component.data` . so in this exmaple, we just simply clear the username in `component.data`.



```javascript
var HelloRegular = Regular.extend({
  template: '#hello',
  login: function(){
    var data = this.data; // get data
    data.username = prompt("please enter your username", "")
  }
});

```

__RESULT__

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/C2Gh9/10/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>




## 5. when the component's digest phase will be triggered

just like angular. regular's data-binding is based on dirty-check. some builtin (.e.g event, [timeout](../core/use.html#timeout)) will tirgger the component's digest phase automatically. you can also trigger the digest manually using [component.$update](../core/binding.html#update)


```javascript

component.data.user.name = "regularjs";
component.$update() // enter

// component.$update('user.name', 'update-set')

// component.$update({
//  'user.name':  'update-set-multi'
// })

//  component.$update(function(data){
//     data.user.name='update-apply'
//  })
```

just like the example above, the usage of `$update` is flexible.


__[|DEMO|](http://fiddle.jshell.net/leeluolee/C2Gh9/5/)__


> no matter how you use the `$update`. the component will always enter into the 'digest' phase.









