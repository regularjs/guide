
# 过滤器Filter

regularjs通过[filter函数]({{syntax}}#filter)来定义一个过滤器.


## 使用过滤器


过滤器 是一种 表达式 在regularjs中使用, 与其它表达式并无不同:

```html
<p>{ [1,2,3] |join: "+" } = 6</p>
```

__output__

```html
<p>1+2+3 = 6</p>
```


需要注意的是过滤器的优先级比三元操作符(`a? b: c`)更低，你可以使用括号提高它的优先级

```
<p>{ 'add: ' + ([1,2,3]|join: '+')  } = 6</p>
```


## 双向过滤器

regularjs支持一个简单的概念: 双向过滤器.它 主要是帮助我们实现数据的对流, 对任意数据读或写操作时可以进行过滤操作

细节我不再描述， 它在[API文档中]({{ref}}?api-zh#two-way-filter)有详细说明. 


## 简单例子: format


__Example__

创建一个简单的日期格式化过滤器

```javascript
// simplest date format

function fix(str){
  str = "" + (str || "");
  return str.length <= 1? "0" + str : str;
}

var maps = {
  'yyyy': function(date){return date.getFullYear()},
  'MM': function(date){return fix(date.getMonth() + 1); },
  'dd': function(date){ return fix(date.getDate()) },
  'HH': function(date){ return fix(date.getHours()) },
  'mm': function(date){ return fix(date.getMinutes())}
}

var trunk = new RegExp(Object.keys(maps).join('|'),'g');

Regular.filter("format", function(value, format){
    format = format || "yyyy-MM-dd HH:mm";
    value = new Date(value);

    return format.replace(trunk, function(capture){
      return maps[capture]? maps[capture](value): "";
    });
  }
})

```

然后

```html
<p>{time| format: 'yyyy-MM-dd HH:mm'}</p>

```


# 计算属性

尽管regularjs的表达式支持非常完备，但是在某些情况下，创建计算属性(computed property)可以让你避免书写冗余的表达式

## 使用

你可以在`Component.extend`或`new Component`时传入`computed`参数

> 与参数`data`类似，`Component.extend`中传入的`computed`会被`new Component`的`computed`合并.


### 你可以传入多种类型的计算属性


__包含 `get/set`的对象__

- get(data): 属性的getter函数
  - data: `data` 指向 component.data
  - this: `this` 指向组件component

- set(value, data):  属性的 setter函数
  - value: the value to set
  - data: `data` 指向 component.data
  - this: `this` 指向组件component

其中set是可选的


```javascript
var component = regular.extend({
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
var component = regular.extend({
  computed: {
    fullname: function(data){
        return data.first + "-" + data.last;
    }
  }
})

```


__传入一个字符串表达式, 它会被处理成Expression对象__


```javascript
var component = regular.extend({
  computed: {
    fullname: "first+ '-' + last"
  }
})

```

这样你就可以在模板中使用了

```javascript

var Component = Regular.extend({
  template: 
    "<div>fullname: <input r-model={fullname}></div>"+
    "<div>first: <input r-model={first}></div>"+
    "<div>last: <input r-model={last}></div>"+
    "<div>Wellcome! {wellcome}</div>",
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

var component = new Component({
  computed: {
    wellcome: "'welcome' + fullname"
  },
  data: {first: '1', last: '2'}
}).$inject("#app");

```



<h2 align="center">[See Demo](http://codepen.io/leeluolee/pen/vgqzd)</h2>



## 利用计算属性 处理 「全选/反选」

比如我们在处理列表时的全选反选逻辑， 就可以用计算属性来简单处理

```js

var ListComponent = Regular.extend({
  computed: {

    selectAll: {
      // only every item is selected, we return true
      get: function(data){
        if(!data.list) return false;
        return data.list.filter(

            function(item){ return !!item.selected}

          ).length===data.list.length;
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

对应的模板

```html

<ul>
{#list list as item}
<li>
  <label><input type="checkbox" r-model={item.selected}><b>{item.text}</b></label>
</li>
{#else}
<li>Sorry! no matched items</li>
{/list}
</ul>

<label><input type="checkbox" r-model={selectAll}><b>Select All</b></label>

```

__从数据出发去考虑业务逻辑__， 会让你节省大量的时间







