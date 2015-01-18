# Computed Property

since version `0.2.4`, regularjs have added `computed property` support.



Although regularjs have the full support for `ES5 Expression`. in some case, the computed property may helping you to avoiding complicated wacher-binding.


## Usage

you can either passing `computed` property to `Component.extend` or `new Component`. 

> just like property `data`, the `computed` on `Component.extend` will be merged by the `computed` on `new Component`. 


__Param__
  - computed: An HashMap contains computeProperties

you can define computed property via serval ways

__Example__

computedProperty with fully specified get/set function

- get(data): the getter of the property
  - data: `data` point to component.data
  - this: `this` point to component

- set(value, data):  the setter of the property
  - value: the value to set
  - data: `data` point to component.data
  - this: `this` point to component


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

with get function only, the param and context is the some.

```javascript
var component = regular.extend({
  computed: {
    fullname: function(data){
        return data.first + "-" + data.last;
    }
  }
})

```


with a String, the String will be parsed as a Expression

```javascript
var component = regular.extend({
  computed: {
    fullname: "first+ '-' + last"
  }
})

```

then you can use it in template

```javascript

var Component = Regular.extend({
  template: 
    "<div>fullname: <input r-model='fullname'></div>"+
    "<div>first: <input r-model='first'></div>"+
    "<div>last: <input r-model='last'></div>"+
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



