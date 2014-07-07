##nested component

regular's component is __nestable__ if it has a registered name


1. specify the name attribute at node that contains the template-string.

  ```html
  <script type='template/regular' name='pager'>
    ...template
  </script> 
  ```
2. pass `name` param in `Component.extend`
  ```javascript
  var Pager = Regular.extend({
    name: 'pager',
    // ...
  })
  ```

__USAGE__

```html
<pager current={{current}} total = {{total}} on-nav={{this.nav}}>
  
</pager>
```

[|DEMO|](http://jsfiddle.net/leeluolee/DCFXn/)


这个例子中两个pager子组件，与上层定义组件的total、current字段，实现了双向绑定，继而实现了这个两个分页器的联动动作。


几点说明

1. 标签名`pager`即Pager组件指定的组件名
2. 非Expression类型的属性值会作为内嵌组件的参数传入，不会建立绑定关系
3. Expression的属性值会与内嵌组件建立绑定关系, 比如current相当于是绑定了
  ```javascript
    this.$bind(pager, 'current', 'current')
  ```
2. `on-*`绑定一个组件方法，当内嵌组件抛出`$emit`某个自定义事件时, 将会转移到Expression制定的方法处理(注意虽然与ui事件的绑定方式类似，但是是不同的概念)


