# 计算字段与过滤器

## 计算属性 {#computed}

计算属性在 [options](../reference/api.md#options) 通过 `computed` 字段注册，可以避免书写冗余的[表达式](../reference/expression.md) 


### 计算属性 - 手动构造表达式对象

使用计算字段相当于手动构造[表达式对象](../reference/expression.md#setable)

__对象包含`get`和`set`(可选)方法__，

- `get(data)`: 属性的 getter 函数，定义 __读__ 逻辑
  - data: `data` 指向 component.data
  - this: `this` 指向组件component

- `set(value, data)`:  属性的 setter 函数，定义 __写__ 逻辑
  - value: the value to set
  - data: `data` 指向 component.data
  - this: `this` 指向组件component

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


var ListComponent = Regular.extend({
  computed: {
    selectAll: {
      // only every item is selected, we return true
      get: function(data){

        if(!data.list) return false;

        return data.list.filter(

            function(item){ return !!item.selected}

          ).length === data.list.length;
      },
      set: function(value, data){
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

> __从数据出发去考虑业务逻辑__，会让你节省大量的时间

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

### 过滤器的优先级

过滤器是一个优先级小于三元表达式(如 `a?b:c` )的表达式

```html
<div>{['Add', 'Update']|last}</div>
```


与标准表达式一样，你可以使用`()`来提升它的优先级

```html
<div>{ 'add: ' + ([1,2,3]|join: '+')  } = 6</div>
```

__输出__

```html
<div> add: 1+2+3 = 6</div>
```



### 简单例子: format

Regular 没有内置的format过滤器， 因为这个过滤器全功能实现，你可以通过以下代码实现一个简单的日期过滤器

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

<script async src="//jsfiddle.net/leeluolee/q0s1mbvg/embed/"></script>

```



### 双向过滤器

Regular 支持一个简单的概念: 双向过滤器，使得过滤器可以代理写操作，与[计算字段类似]()，你需要理解一个[表达式对象](../reference/expression.md#setable)实际是由 __get__(读操作) 和 __set__ (写操作) 构成

双向过滤器如其名，经常会用在双向绑定上， 由于这个特性， r-model 得以与一个数组类型实现双向绑定。 当然你也可以使用它在其它可能有“数据回流”场合，比如[内嵌组件](?syntax-zh#composite)





take `{[1,2,3]|join: '-'}` for example

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

```html

{array|json}
<input r-model={array|join:'-'} >

```

[【 DEMO : two-way filter】](http://codepen.io/leeluolee/pen/jEGJmy)

### 过滤器与计算字段的对比


### 内置过滤器


为了控制框架体积，Regular 只有少量内置过滤器，其中 __不包含format!__ ，你参考上例实现，或直接使用更详细的包，例如 [moment.js](http://momentjs.com/)

- `json`: 

- `last`

