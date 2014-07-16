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

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/DCFXn/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


some tips

1. the tagname `pager` is the component's name.
2. if the attribute value is not an Expression. it will be passed as param without create the binding.
3. if the value is an Expression. there will be [an two-way binding or one-way binding that depend on Expression]() between the outer component and nested component. it equals that

  ```javascript
    this.$bind(pager, 'current', 'current')
  ```
4. similar with [event](../core/) `on-*`绑定一个组件方法，当内嵌组件抛出`$emit`某个自定义事件时, 将会转移到Expression制定的方法处理(注意虽然与ui事件的绑定方式类似，但是是不同的概念)


