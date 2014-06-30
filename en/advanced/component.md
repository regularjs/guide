##嵌套组件

regular中定义的组件是可以内嵌的, 但是这个组件必须是具名的，可以通过两种方式

1. 模板容器的标签上添加name属性
  ```html
  <script type='template/regular' name='pager'>
    ...template
  </script> 
  ```
2. 在组件定义时传入name参数 
  ```javascript
  var Pager = Regular.extend({
    name: 'pager',
    // ...
  })
  ```

一个典型的组件内嵌方式是

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


