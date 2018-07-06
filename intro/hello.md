# 你好，Regular

我们即将实现一个简单的登录组件：__HelloRegular__。

[](codepen://Lingyucoder/AsFJh?height=800&theme=0)


## 初始结构 


```html
<!-- 容器节点 -->
<div id="app"></div>

<!-- 引入regular.js (生产环境请使用安装版本) -->
<script src="https://cdn.jsdelivr.net/npm/regularjs"></script>


<script>
//利用Regular构建你的app吧
var HelloRegular = Regular.extend({
  template: `
    Hello, {username}
  `
});

// initialize component then $inject to #app's  bottom
var component = new HelloRegular({
  data: {username: "leeluolee"}
});

component.$inject('#app'); 

</script>

```


<p data-height="265" data-theme-id="dark" data-slug-hash="OEqagB" data-default-tab="html,result" data-user="leeluolee" data-embed-version="2" data-pen-title="HelloRegular" class="codepen">See the Pen <a href="https://codepen.io/leeluolee/pen/OEqagB/">HelloRegular</a> by leeluolee (<a href="https://codepen.io/leeluolee">@leeluolee</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

__说明__

* __`Regular.extend(definition)`__

  创建一个继承自 Regular 的组件， `definition` 对象的属性会成为此组件的 __原型属性。__


* `template`

  这个范例模板中使用了 `{}` 插值语法


* `data`
  
  组件实例的初始化数据可以通过`data`属性传入。


  <a name="$inject"></a>
* `$inject(node[, direction])`

  实例方法`$inject`可以将组件插入到目标节点的指定位置

  * `bottom`[默认参数]：作为 node 的 lastChild 插入
  * `top`：作为 node 的 firstChild 插入
  * `after`：作为 node 的 nextSibling 插入
  * `before`：作为 previousSibling 插入



## 使用条件展示

接下来我们在模板中使用`if/else`语句处理未登录的情况

```html
{#if username}
  Hello, {username}.
{#else}
  Sorry, Guest.
{/if}
```

<iframe height='265' scrolling='no' title='HelloRegular-2' src='//codepen.io/leeluolee/embed/yEwmBJ/?height=265&theme-id=dark&default-tab=html,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/leeluolee/pen/yEwmBJ/'>HelloRegular-2</a> by leeluolee (<a href='https://codepen.io/leeluolee'>@leeluolee</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## 绑定事件处理逻辑

直接在节点上声明 `on-click` 绑定`click`事件

```html
{#if username}
  Hello, {username}. <a href="javascript:;" on-click={username = ''}>Logout</a>
{#else}
  Sorry, Guest. Please <a href="javascript:;" on-click={this.login()}>Login</a>
{/if}

```


> __tips:__ 
>
> Regular 中 `on-`开头的属性会被作为事件绑定处理，每当对应的ui事件触发。会将传入的表达式运行一次


这里我们添加了两个用户操作:

__登出__ ：Regular 的表达式支持赋值操作，这里的登出我们仅仅是对 `username` 做了清空处理。

__登录__ ：模板中的`this`对象指向实例component本身，我们需要在extend时添加一个原型方法`login()`来处理登录逻辑。


```javascript

login: function(){
  var data = this.data; // get data
  data.username = prompt("please enter your username", "")
}

```


<iframe height='265' scrolling='no' title='HelloRegular-2' src='//codepen.io/leeluolee/embed/wXZwMJ/?height=265&theme-id=dark&default-tab=html,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/leeluolee/pen/wXZwMJ/'>HelloRegular-2</a> by leeluolee (<a href='https://codepen.io/leeluolee'>@leeluolee</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>



## 下一步阅读

1. 或许你对为什么数据变化会反应到视图差生疑惑，推荐你阅读 __[脏检查： 数据绑定的秘密](concept/dirty.md)__






