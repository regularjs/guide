# 计算属性

__从版本 `0.2.4` 开始，regularjs提供了计算属性的支持__

尽管regularjs的表达式支持非常完备，但是在某些情况下，创建计算属性(computed property)可以让你避免书写冗余的表达式

## 使用

你可以在`Component.extend`或`new Component`时传入`computed`参数

> 与参数`data`类似，`Component.extend`中传入的`computed`会被`new Component`的`computed`合并。


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


__传入一个字符串表达式，它会被处理成Expression对象__



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


> You can also check the [TODOMVC](http://codepen.io/leeluolee/pen/eAmnB) to learn how computedProperty help us simplify our expression on template

