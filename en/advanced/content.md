
#regularjs中的transclude

regularjs没有实现angular那种完整的transclude支持，但是可以允许你在使用内嵌组件时

1. 内嵌组件可以传入子元素
2. 这些子元素可以通过`r-content`指定到内嵌组件的某个位置
3. 这些子元素的context, 仍然属于外层组件

__Exmaple__

将我们用了多次的modal组件改写成以下形式


```javascript
<script id="modal" type="text/regular" name='modal'>
  <div class="modal show {clazz}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" on-click={this.close()} data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">{title}</h4>
        </div>
        <div class="modal-body">
         <!-- use r:content as placeholder for passin body -->
          <r-content />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" on-click={this.close()} >Close</button>
          <button type="button" class="btn btn-primary" on-click={this.confirm()}>Confirm</button>
        </div>
      </div>
    </div>
  </div>
</script>
```



使用此内嵌组件时

```javascript
var App = Regular.extend({
  template:
    '<modal title="title">\
        <a href="#" on-click={this.click()}>hello</a>\
    </modal>',
  click: function(){
    alert('passin-body"s context is outer component ')
  }
})

var app = new App({data: {title: "hahaha"}).$inject('#app');
```
[|DEMO|](http://jsfiddle.net/leeluolee/4wuDZ/)

此时，传入modal的`<a href="#" on-click={this.click()}>hello</a>`作用于在定义的component(即app实例)中，所以可以调用它原型上的click函数

---------------------------------------




