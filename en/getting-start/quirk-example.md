
#Quirk Example

In this section, we will create our first component based regularjs —— __HelloRegular__ . it used to show  message to people friendly. if people don't login yet, the component needs to prompt people. for simplicity, only username is required with login .



## 1. initial template

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

// initialize component then inject to #app's  bottom
var component = new HelloRegular({
  data: {username: "leeluolee"}
});
component.inject('#app'); 
</script>

```

__RESULT__


<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/C2Gh9/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>



* __`Regular.extend`__

  Regular.extend will create a Component extended form Regular. 

* `template`

  a Component may need template to describe its structure.


* `data`
  
  component's model, but it just a Plain Object.  the `data` passed to `new Component` will merge the `data` passed to `Component.extend`


* `inject(node[, direction])`

  it is a instance method, inject the component to the position that depending on the parameter 'direction'
    * `bottom`[default option]: injected as node's lastChild 
    * `top`: injected as node' s firstChild,
    * `after`: injected as node' s nextSibling,
    * `before`: injected as node' s prevSibling,






## 2. Using __inteplation__ to show user's name

this component only show the constant message until now, we should make it living by using __inteplation__.


```html
  Hello, {{username}}
```

__RESULT__

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/C2Gh9/8/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


## 3. using `if/else` to show other message if the user is not logged in 


```xml
{{#if username}}
  Hello, {{username}}.
{{#else}}
  Sorry, Guest.
{{/if}}
```

it just like we use the other string-based template.


__RESULT__

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/C2Gh9/9/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>




## 4. Implement the `Login/Logout`  by event

in this step , we need to add two event to deal with the __Login__ and __Logout__ operation.

```html
{{#if username}}
  Hello, {{username}}. <a href="javascript:;" on-click={{username = ''}}>Logout</a>
{{#else}}
  Sorry, Guest. Please <a hreaf="javascript:;" on-click={{this.login()}}>Login</a>
{{/if}}

```

> <h5>Tips</h5>

>in regular,  the `on-` prefixed attribute will be considered as [ui event](../core/event.md)， it must be followed with a Expression(string or inteplation is all valid). the expression will be evaluated everytime when the event is trigged(just like angular). 

> you can also define your custom event like(e.g. `on-hold` or `on-tap`) and determine when to trigger it;


we add two operation in the template above: 


__Login__: the keyword `this` in the template just point to `component` self. so we need to add a method named __login__ at HelloRegular's prototype .

__Logout__: the model's root in template is point to `component.data` . so in this exmaple, we just simply clear the username in `component.data`.



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




## 5. when the component's digest phase will be triggerd

just like angular. regular's data-binding is based on dirty-check. some inner logic(.e.g event, $timeout) will tirgger the component's digest phase()
与angular一样，regular中的数据绑定也是基于数据的脏检查，ui事件触发的响应会自动进入$digest阶段并进行数据检查和ui更新, 而对于在组件lifecycle之外的数据变动，你需要进行手动的`$update` 以进入数据检查阶段

```javascript

component.data.username = "regularjs";
component.$update() // enter

// component.$update('username', 'update-set')

//  component.$update(function(data){
//     data.username='update-apply'
//  })
```


__[|DEMO|](http://fiddle.jshell.net/leeluolee/C2Gh9/5/)__ 

你可以利用`$update`实现常见的set操作，或类似angular的`$apply`功能. 无论何种方式调用`$update`, __都会迫使组件进入数据检查阶段__


然而在实际使用中，`$update`不会常常用到, 因为组件本身是一个闭环,大部分类似ui事件，timeout等都会自动进入update阶段, 从而可以直接操作数据对象即可. 








