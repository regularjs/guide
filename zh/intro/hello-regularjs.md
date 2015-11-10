#快速起步

这一小节，我们将实现一个简单的组件—— __HelloRegular__ ，它用来显示友好的用户欢迎语，但是如果用户未登录的话需要提示进行登录信息，为了简单起见只需要输入用户名就可以进行登录。

经过本节学习，你将会了解：

1. 如何初始化regularjs页面
2. 使用[插值]({{ref}}?syntax-zh#interpolation)
3. 使用[逻辑(if/else)]({{ref}}?syntax-zh#if)来切换显示
4. 使用on-xx事件绑定。


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

[__&#x261E; 查看结果__](http://fiddle.jshell.net/leeluolee/C2Gh9/1/)

* __`Regular.extend`__

  Regular.extend用来创建一个继承自Regular的组件类，所有传入extend的属性都会成为此组件类的原型属性。


* `template`

  一般来讲一个组件会需要一个模板来描述组件的结构，这里我们传入包含模板的容器节点的选择器（你也可以直接传入模板字符串）。


* `data`
  
  组件component可能需要一些初始化状态，这些数据我们可以在实例化组件时作为`data`传入。

  > 需要注意的是在实例化组件传入的参数会被作为实例属性，所以可以在这里覆盖extend的定义（原型属性）。


  <a name="$inject"></a>

* `$inject(node[, direction])`

  这是个组件的实例方法，会将组件插入到目标节点制定位置

  * `bottom`[默认参数]：作为node的lastChild插入
  * `top`：作为node的firstChild插入
  * `after`：作为node的nextSibling插入
  * `before`：作为previousSibling插入






## 2.显示用户姓名——插值

目前为止，这个组件仅仅只是显示了一个静态信息，我们在模板中简单添加一个 __[插值](sytax/inteplation.md)__ 来显示用户信息，需要注意的是regularjs的内建模板是 __'活动'__ 的，如果你更新了数据状态，ui将会自动更新。

```html
  Hello, {username}
```

[__&#x261E; 查看结果__](http://fiddle.jshell.net/leeluolee/C2Gh9/2/)

## 3. 处理未登录的情况——if/else逻辑控制

接下来我们处理未登录的用户情况：

```xml
{#if username}
  Hello, {username}.
{#else}
  Sorry, Guest.
{/if}
```

就与常规的字符串模板（例如jst）类似，模板里我们添加`if/else`来区分登录用户与游客的显示效果。


[__&#x261E; 查看结果__](http://fiddle.jshell.net/leeluolee/C2Gh9/3/)


## 4. 实现用户登录登出的功能—— `on-click`

这里同时我们添加了两个click事件来处理用户的登录与登出逻辑：

```html
{#if username}
  Hello, {username}. <a href="javascript:;" on-click={username = ''}>Logout</a>
{#else}
  Sorry, Guest. Please <a href="javascript:;" on-click={this.login()}>Login</a>
{/if}

```


> __tips:__ 
>
> regular中 `on-`开头的属性会被作为事件绑定处理，每当对应的ui事件触发。会将传入的表达式运行一次(与angular的事件系统类似。你可以通过`Regular.event`来扩展自定义ui事件，例如`on-tap`这种dom中并不原生支持的事件


这里我们添加了两个用户操作:

__登出__ ：由于regular的表达式支持赋值操作，这里的登出我们仅仅是对username做了清空处理。

__登录__ ：模板中的this对象指向实例component本身，我们需要在extend时添加一个原型方法__login__来处理登录逻辑。


```javascript
var HelloRegular = Regular.extend({
  template: '#hello',
  login: function(){
    var data = this.data; // get data
    data.username = prompt("please enter your username", "")
  }
});

```

[__&#x261E; 查看结果__](http://fiddle.jshell.net/leeluolee/C2Gh9/4/)


## 小节

虽然这个例子非常简单，但是基本上实现一个组件的思路大同小异

1. 根据需求得到静态html结构，并将其模板化，并结合Regular.extend将其封装成一个组件。
2. 根据业务需求添加dom事件并添加对应的组件原型方法（如上例的login）
3. 如果需要你还可能将部分可重用功能拆分为[子组件](../component/README.md)


## 下一步阅读

1. 或许你对为什么数据变化会反应到视图差生疑惑，推荐你阅读 __[脏检查： 数据绑定的秘密](concept/dirty.md)__






