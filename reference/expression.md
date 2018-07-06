# 表达式 


## ES5 表达式

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


除了 ES5 的表达式，Regular 还提供了以下几种表达式类型


##  一次性绑定 {#bind-once}


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


## 过滤器Filter {#filter}

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


##  Range {#range}

Range 即数组的简写模式

__Syntax__: 

` start..end `


__Example__

`1..3 === [1,2,3]`


##  错误抑制

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



