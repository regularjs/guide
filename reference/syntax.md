#  模板语法

以下简称Regularjs的模板为__rgl__


## 表达式 {#expression}


### ES5 表达式

Regular 支持几乎所有 ES5 表达式语法，下列都是合法的表达式


- 100 + 'b'.
- user? 'login': 'logout'
- title = title + '1'
- !isLogin && this.login()
- items[index][this.nav(item.index)].method1()



__几个注意点__

1. __表达式中的`this`指向组件本身__
2. __数据根路径从 `component.data` 开始, 即`user` 其实获取的是`component.data.user`__
3. rgl不支持自增、自减(`++`,`--`)以及位操作符`&` `|`等
4. rgl不支持正则表达式的字面量
5. rgl开放了部分JS内建对象:
  - Array Date JSON Math NaN RegExp Object String
  - decodeURI decodeURIComponent encodeURI encodeURIComponent 
  - parseFloat parseInt 


除了ES5的表达式，Regular还提供了以下几种表达式类型

<a id="bind-once"></a>

### 一次性绑定 {#bind-once}


脏检查性能依赖于监听器的数量，Regular引入了`@()`预发提供了一次绑定功能： 监听器在一次变更后就会被移除。 


__syntax__

`@(Expression)`

> 可以在任意的表达式环境使用`@()`(`list`, `if`... etc)


__Example__

```html
<div>{ @(title) }</div> // the interpolation only trigger once

{#if @(test)}  // only test once
//...
{/if}

{#list @(items) as item}  // only trigger once
//...
{/list}

```


- 你也可以在`$watch` 使用 `@()`

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


如上例所示，由于『脏了一次就被被抛弃』, 如果值后续继续变化，会导致UI与数据不同步。


<a id="filter"></a>
###过滤器Filter {#filter}

__syntax__

`Expression| fitlerName: arg1, arg2,... argN `


```javascript

Regular.filter({
  'last': function(obj){
    return obj[obj.length-1]; 
  },
  'lowercase': function(obj){
    return obj.toLowerCase(); 
  }
})

const Component = Regular.extend({
  template: `
    <div>{list|last|lowercase}</div>
  `
})

new Component({
  data: {
    list: ['Add', 'Update', 'Delete']
  }
}).$inject(document.body)
```


Regular 还支持一些过滤器的高阶玩法，比如[双向过滤器](./api.html#filter)

<script async src="//jsfiddle.net/leeluolee/npsthb45/embed/js,result/"></script>



### Range


Range 即数组的简写模式

__Syntax__: 

` start..end `


__Example__

`1..3 === [1,2,3]`


### 错误抑制

在动态模板中，如果抛出所有JS中常见的 `xx of undefined` 的错误，整个系统会变得相当脆弱。Regular 抑制了这类错误中安全的部分，并使用undefined代替


```js

new Regular({
  template: "<div>{blog.user.name}</div>"
})

// => <div></div>

```


如果是方法不存在产生的错误，Regular 仍然会抛出，这属于「非安全」的错误

```js

new Regular({
  template: "<div>{this.methodNoFound(blog.user.name)}</div>"
})

```


<script async src="//jsfiddle.net/leeluolee/xb1Lovc9/embed/js,result/"></script>

其中`blog.user.name`错误被抑制，而`this.methodNoFound`的未定义错误会被抛出







## 插值 {#interpolation}


插值是rgl中最常用模板元素


__Syntax__


`{Expression}`

###文本插值

针对文本插值，Regular会创建一个textNode,并建立表达式到`textContent`的 __单向数据绑定__


__Example__

```js

var app = new Regular({
  template: "<div>{username}</div>",
  data: {username: 'leeluolee'}
});

app.$inject('#app');


```


上面的例子会输出`<div>leeluolee</div>`，并且一旦数据发生改变，文本节点内容也会发生改变





### 属性插值


Regular 目前仅允许属性值可以被插值。

__几个注意点__

1. 如果文本内部具有插值符号`{}`, Regular会解释成组合表达式，如`.modal-{klass} z-{state}` 就相当于是 `'.modal-' + klass + 'z-' + state`。

2. 对于非指令类的的属性, Regular会在值变化时, 修改对应属性, 即一般属性(`class`, `style`，`title`等)是天生可插值的。

3. 对于指令类的属性, Regular会将具体处理逻辑交由[指令的link](./api.html#directive)方法处理。


__Example__

```javascript

<input
  type='radio'
  class={klass}
  r-model={checked}
  style="left: {10 + offsetX}px; top: {10 + offsetY}px"
  > 

```

上述几个属性结果如下

1. `r-model`: 参考[内置指令](./directive.html#r-model)
2. `style`: 即上述的字符串组合插值
3. `class`: 简单属性插值
4. `type`: 没有插值



### Body 插值


__body param__ 只能用于组件








## 功能语句


rgl 除了插值和表达式之外的语法元素就只有语句了


__Syntax__

`{#NAME ...}Block..{/NAME}`

或者自闭合语句

`{#NAME /}`



目前 rgl 中只有三类语句: `list`, `if/else/elseif` 和 `include`，未来也会通过相同的语法来进行扩展


⚠️ Regular中 语句和XML标签是不能被相互打断的

__错误 __

```xml
<div>
{#if true}
  <p>True</p>
</div>
{#else}
  <p>False</p>
</div>
{/if}

```

__正确__

```xml

<div>
{#if true}
  <p>True</p>
{#else}
  <p>False</p>
{/if}
</div>

```



## 循环控制 - list语句 {#list}


list指令用来遍历某个sequence来循环的处理某些重复性的结构



__Syntax >__: 

```html
{#list sequence as item}
  ...block...
{/list}

```

__where__

* sequence: Expressions evaluates to a sequence or collection
* item: Name of the loop variable (not an expression)




在每次循环都会创建一个临时变量代表当前下标

* `item_index`(取决于你的item命名): 代表当前遍历到的下标(从0开始, 类似与angular中的`$index`变量) 




__Example >__

```js
var component = new Regular({
  template: 
    "{#list items as item}\
     <span class='index'>{item_index}:{item}</span>\
     {/list}",
  data: {
    items: ["a", "b", "c", "d"]
  }
})

component.$inject(document.body);

```

__resulting html__

```html
<span class="index">0:a</span>
<span class="index">1:b</span>
<span class="index">2:c</span>
<span class="index">3:d</span>
```

<a id="if"></a>


### list 可以使用 `#else`语句

你可以在list 中嵌入`#else`语句来展现当list__不存在__ 或__为空__的情况


__Example__


如果`list` 是一个空数组或空值 (`[]`, `null`, `undefined` )



The template

```html
{#list list as item }
  <div class='item'>{item}</div>
{#else}
  <div class='altnate'> no result here  </div>
{/list}
```

will output ` <div class='altnate'> no result here  </div> `






### 使用 `track by` 特性加速你的list语句






### 使用`#list` 去遍历数组 (until `v0.4.3`)

在遍历对象时， 除了`item_index`, `item` ， 还额外提供一个循环变量`item_key`(同样取决于item的命名)




```html
{#list ageMap as age }
<div class='age'>{age_key}:{age}</div>
{/list}
```

with `data.ageMap = {'jack': 11 , 'tommy': 22 } ` will output

```html
<div class='age'>jack:11</div>
<div class='age'>tommy:22</div>
```



## 逻辑控制 - if/else/elseif


与其它模板引擎(如freemarker)一样, regular也提供了`if`,`elseif`,`else`等语法元素提供对逻辑控制的支持



__Syntax__


```html
{#if condition}
...
{#elseif condition2}
...
{#else}
...
{#if}
```


where:
- condition: 判断条件Expression，这个表达式结果会被强制转换为Boolean值


__Example__

```html

{#if user.age >= 80 }
  you are too old
{#elseif user.age <= 10}
  you are too young
{#else}
  Welcome, Friend
{/if}

```






<a name="include"></a>
## 引入控制 - include


include 用来标准引入一些内容，这些内容可能需要在初始化后指定，或可能发生变动。


__syntax__

` {#include template} `


__where__




* template: 一个Expression,求值结果是字符串或模板AST


动态引入会监听传入表达式template的数据变动, 每当变化时会重新编译template,并插入到制定位置, 它带来几个好处

1. 可以配置部分模板内容
2. 可以动态修改展现

其中1的意义要远大于2, 比如你实现一个modal弹窗组件，通常modal结构是固定的, 而内容区通常需后续指定, 这时候`include`就可以大展伸手了



```html
<div id="app"></div>

<!-- Templates -->
<script id="modal" type="text/regular">
  <div class="modal show {clazz}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" on-click={this.close()}>×</button>
          <h4 class="modal-title">{title}</h4>
        </div>
        <div class="modal-body">
          {#include content }
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-default" 
            on-click={this.close()} >Close</button>
          <button 
            type="button" 
            class="btn btn-primary" 
            on-click={this.confirm()}>Confirm</button>
        </div>
      </div>
    </div>
  </div>
</script>

<script>

var Modal = Regular.extend({
  template: '#modal',
  init: function(){
    if(!this.parent) this.$inject(document.body)
  },
  close: function(){
    this.$emit('close');
    this.destroy();
  },
  confirm: function(){
    this.$emit('confirm', this.data);
    this.destroy();
  }
});

var modal = new Modal({
  data: {
    content: '<input type="email" class="form-control" r-model={email}>',
    title: 'please confirm your email'
  }
});

modal.$on('confirm', function(data){
  console.log(data.email)
});
</script>



```

[【DEMO】](https://fiddle.jshell.net/leeluolee/Xvp9S/)





##注释

直接使用XML注释即可

```xml
<!-- you comment -->
```


