# 计算字段与过滤器

Regular 提供了两种自定义[表达式](../reference/expression.md#setable)读写的方式 —— __计算字段__ 和 __过滤器__

## 计算字段 {#computed}

计算字段在 [options](../reference/api.md#options) 通过 `computed` 字段注册，可以避免书写冗余的[表达式](../reference/expression.md) 


### 计算字段的定义

使用计算字段相当于手动构造 __[表达式对象](../reference/expression.md#setable)__

__对象包含`get`和`set`(可选)方法__，

- `get(data)`: 属性的 getter 函数，定义 __读__ 逻辑
  - data: `data` 指向 component.data
  - this: `this` 指向组件 component

- `set(value, data)`:  属性的 setter 函数，定义 __写__ 逻辑
  - value: the value to set
  - data: `data` 指向 component.data
  - this: `this` 指向组件 component

_其中set是可选的_

```js

const Component = Regular.extend({
  computed: {
    fullname: {
      get: function(data){
        return data.first + "-" + data.last;
      },
      set: function(value, data){
        var tmp = value.split("-");
        data.first = tmp[0];
        data.last = tmp[1];
      }
    }
  }
})
```

__直接传入函数，它会作为getter函数存在__

```javascript

const Component = Regular.extend({
  computed: {
    fullname: function(data){
        return data.first + "-" + data.last;
    }
  }
})

```

上例你也可以简写成一个表达式

```javascript
const Component = Regular.extend({
  computed: {
    fullname: `first+ '-' + last`
  }
})

```

完整的使用范例

```javascript
const Component = Regular.extend({
  template: `
    <div>fullname: <input r-model={fullname}></div>
    <div>first: <input r-model={first}></div>
    <div>last: <input r-model={last}></div>
    <div>{welcome}</div>
  `,
  computed: {
    welcome: `'Hello, '+ fullname`,
    fullname: {
      get: function(data) {
        return data.first + "-" + data.last;
      },
      set: function(value, data) {
        const tmp = value.split("-");
        data.first = tmp[0];
        data.last = tmp[1]||'';
      }
    }
  }
})

const component = new Component({
  data: {
    first: '1',
    last: '2'
  }
}).$inject(document.body);

```

<script async src="//jsfiddle.net/leeluolee/hjkcu9z6/embed/result,js/"></script>

__说明__

- `welcome`: 只读的计算字段
- `fullname`: 由于设置了set，是可读可写的计算字段，可用于双向绑定



### 计算字段的读写

如果你需要在 javascript 对定义的计算进行读写会失败，因为要兼容低版本IE，计算字段并非通过`Object.defineProperty`实现，不过 Regular 提供了途径来获取计算字段 -- [$get](../reference/api.md#get)
```js

const Component = Regular.extend({
  computed:{
    fullname: `first + '-' + last`
  }
})

const component = new Component({
  data: {
    first: 'Zheng'
    last: 'Haibo'
  }
});

console.log(component.data.fullname) // undefined
console.log(component.$get('fullname')) // 'Zheng-Haibo'

```

实际上 `$get` 也可以应用与所有表达式。

```js
component.$get('"Hello, " + fullname')
```


__参考__

- [$get](../reference/api.md#)


### 计算字段范例: 「全选/反选」

```java


const ListComponent = Regular.extend({
  computed: {
    selectAll: {
      // only every item is selected, we return true
      get: function( data ){

        if(!data.list) return false;

        return data.list.filter(

            function(item){ return !!item.selected}

          ).length === data.list.length;
      },
      set: function( value, data ){
        if(!data.list) return
        // set every item.selected with passed value
        data.list.forEach(function(item){
          item.selected = value;
        })
      }
    }
  }

})

```

__template__

```html

<ul>
{#list list as item}
  <li>
    <label><input type="checkbox" r-model={item.selected}><b>{item.text}</b></label>
  </li>
{/list}
</ul>

<label><input type="checkbox" r-model={selectAll}><b>Select All</b></label>

```


<script async src="//jsfiddle.net/leeluolee/739w65xa/embed/result,js/"></script>


## 过滤器 - filter

过滤器是 Regular 中的一种[扩展表达式类型](../reference/expression.md#filter) , 你可以和`+`、`-`符号一样去使用它。

__Syntax__

`Expression| fitlerName: arg1, arg2,... argN `

__Example__

```html
<div>{list| join: '+'}</div>
```

### 定义过滤器

你可以通过[`Regular.filter`](../reference/api.md#filter)来定义一个过滤器。

下例会定义一个join数组为字符串的，它接受一个split参数

```javascript
Regular.filter({
  'join': function( list, split ){
    return list.join(split||'-')
  }
})

new Regular({
  template:`
    <div>{list|join:'+'}</div>
  `,
  data: {
    list: ['Add', 'Update', 'Delete']
  }
})
```

<script async src="//jsfiddle.net/leeluolee/btjfac04/embed/result,js/"></script>

### 过滤器参数

过滤器参数可以传入任意个，他们会依次传入到过滤器定义的get和 [set](#two-way) 函数中，过滤器参数可以是任意表达式

```js
Reuglar.extend({
  template:`
    <div>{list|join:'+'}</div>
  `
})

```




### 过滤器的优先级

过滤器是一个优先级小于三元表达式(如 `a?b:c` )的表达式，与标准表达式一样，你可以使用`()`来提升它的优先级

```html
<div>{ 'add: ' + ([1,2,3]|join: '+')  } = 6</div>
```

__输出__

```html
<div> add: 1+2+3 = 6</div>
```


### 日期格式化过滤器: format

以下实现了一个简化的 Regular 日期过滤器

__Example__

创建一个简单的日期格式化过滤器

```javascript
// simplest date format

function fix(str) {
  str = "" + (str || "");
  return str.length <= 1 ? "0" + str : str;
}

const maps = {
  'yyyy': function(date) {
    return date.getFullYear()
  },
  'MM': function(date) {
    return fix(date.getMonth() + 1);
  },
  'dd': function(date) {
    return fix(date.getDate())
  },
  'HH': function(date) {
    return fix(date.getHours())
  },
  'mm': function(date) {
    return fix(date.getMinutes())
  }
}

const trunk = new RegExp(Object.keys(maps).join('|'), 'g');

Regular.filter("format", function(value, format) {
  format = format || "yyyy-MM-dd HH:mm";
  value = new Date(value);

  return format.replace(trunk, function(capture) {
    return maps[capture] ? maps[capture](value) : "";
  });
})

```

然后

```html
<p>{time| format: 'yyyy-MM'}</p>

```
<script async src="//jsfiddle.net/leeluolee/q0s1mbvg/embed/result,js/"></script>


### 双向过滤器 {#two-way}

Regular 支持一个简单的概念: 双向过滤器，使得过滤器可以代理写操作，与[计算字段类似](#computed)，你需要理解一个[表达式对象](../reference/expression.md#setable)实际是由 __get__(读操作) 和 __set__ (写操作) 构成

双向过滤器如其名，经常会用在双向绑定上，由于这个特性，`r-model`可以变相与一个数组类型实现双向绑定。


以 `{[1,2,3]|join: '-'}` 为例

 过滤器定义

```js
Regular.filter('join', {
  //["1","2","3"] - > '1-2-3'
  get: function(origin, split ){
    return origin.join( split || "-" );
  },
  // **Important **
  // "1"-"2"-"3" - > ["1","2","3"]
  set: function(dest, split ){
    return dest.split( split || "-" );
  }
})
```

> 说明: 过滤器定义传入函数，则自动成为 `get` 读函数

```html
{JSON.stringify(array)}
<input r-model={array|join:'-'} >

```

__说明__

过滤器劫持了读写，使得字符串类型和数组变相实现了双向绑定。

- __写过程__: 从表单元素的`input.value` 到数据 `array`，先经过 __set__ 函数，从 __字符串 > 数组__
- __读过程__: 从数据`array`到表单元素的`input.value` ，先经过 __get__ 函数，从 __数组 > 字符串__



<script async src="//jsfiddle.net/leeluolee/0oh8e6dj/1/embed/result,js/"></script>

> 如[表达式章节](../reference/expression.md)所述, 部分全局变量如`JSON`在模板中可用


### 过滤器与计算字段的对比

- 过滤器是一个可复用的抽象，而计算字段是一个写死的字段定义
- 计算字段使用更简洁

### 内置过滤器


为了控制框架体积，Regular 只有少量内置过滤器，其中 __不包含format!__ ，你参考上例实现，或直接使用更详细的包，例如 [moment.js](http://momentjs.com/)

- `json`: _这是一个双向过滤器_
  - get: `JSON.parse`
  - set: `JSON.stringify`

- `last`
  - get: `list[list.length-1]`


