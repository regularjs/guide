
#快速起步

这一小节，我们将实现一个简单的组件—— __HelloRegular__ ,它用来显示友好的用户欢迎语，但是如果用户未登录的话需要提示进行登录信息，为了简单起见只需要输入用户名就可以进行登录


## 1.初始结构


```html
<div id="app"></div>

<script id="hello" type="text/regular" name="hello">
  Hello, Guest
</script>

<!-- 引入regular.js -->
<script src="https://rawgit.com/regularjs/regular/master/dist/regular.js"></script>


<script>
//利用Regular构建你的app吧
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

[__点击查看结果__](http://fiddle.jshell.net/leeluolee/C2Gh9/1/), 这里有几个要点：

* __`Regular.extend`__

  Regular.extend用来创建一个继承自Regular的组件类，所有传入extend的属性都会成为此组件类的原型属性


* `template`

  一般来讲一个组件会需要一个模板来描述组件的结构，这里我们传入包含模板的容器节点的选择器(你也可以直接传入模板字符串)


* `data`
  
  组件component可能需要一些初始化状态，这些数据我们可以在实例化组件时作为`data`传入。

  > 需要注意的是在实例化组件传入的参数会被作为实例属性, 所以可以在这里覆盖extend的定义(原型属性)


  <a name="$inject"></a>

* `$inject(node[, direction])`

  这是个组件的实例方法，会将组件插入到目标节点制定位置

  * `bottom`[default option]: $injected as node's lastChild
  * `top`: $injected as node' s firstChild,
  * `after`: $injected as node' s nextSibling,
  * `before`: $injected as node' s prevSibling,



<!-- 1. 模板容器(`#hello`)  
2. script引入regular.js  
3. `Regular.extend`派生组件
4. 初始化节点并插入$inject到指定位置(这里是插入到容器节点`#app`)
 -->




## 2.显示用户姓名——插值

目前为止，这个组件仅仅只是显示了一个静态信息，我们在模板中简单添加一个__[插值](sytax/inteplation.md)__来显示用户信息, 需要注意的是regularjs的内建模板是__'活动'__的，如果你更新了数据状态， ui将会自动更新。

```html
  Hello, {{username}}
```

[ |查看结果| ](http://fiddle.jshell.net/leeluolee/C2Gh9/2/)

## 3. 处理未登录的情况——if/else逻辑控制

接下来我们处理未登录的用户情况


```xml
{{#if username}}
  Hello, {{username}}.
{{#else}}
  Sorry, Guest.
{{/if}}
```

就与常规的字符串模板(例如jst)类似，模板里我们添加`if/else`来区分登录用户与游客的显示效果

[|查看结果|](http://fiddle.jshell.net/leeluolee/C2Gh9/3/)



## 4. 实现用户登录登出的功能—— `on-click`

这里同时我们添加了两个click事件来处理用户的登录与登出逻辑,

```html
{{#if username}}
  Hello, {{username}}. <a href="javascript:;" on-click={{username = ''}}>Logout</a>
{{#else}}
  Sorry, Guest. Please <a hreaf="javascript:;" on-click={{this.login()}}>Login</a>
{{/if}}

```


> __tips:__ 
>
> regular中 `on-`开头的属性会被作为事件绑定处理，每当对应的ui事件触发. 会将传入的表达式运行一次(与angular的事件系统类似). 你可以通过`Regular.event`来扩展自定义ui事件,例如`on-tap`这种dom中并不原生支持的事件


这里我们添加了两个用户操作:

__登出__: 由于regular的表达式支持赋值操作，这里的登出我们仅仅是对username做了清空处理。

__登录__: 模板中的this对象指向实例component本身，我们需要在extend时添加一个原型方法__login__来处理登录逻辑


```javascript
var HelloRegular = Regular.extend({
  template: '#hello',
  login: function(){
    var data = this.data; // get data
    data.username = prompt("please enter your username", "")
  }
});

```

[|查看结果|](http://fiddle.jshell.net/leeluolee/C2Gh9/4/)



## 5. 何时进行数据检查-UI更新的digest阶段

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








