##nested component

regular's component is __nestable__ if it has a registered name. there are two ways to register a component.


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

then you can use this component in other component.

```html
<pager current={outer.current} total='1000' />
```


__USAGE__

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/DCFXn/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


Some Explanation

1. the tagname `pager` represent the component's name.
2. if the value of attribute is not an [Expression]. it will be passed as param without creating the binding.
3. if the value is an [Expression]. there will be an two-way binding or one-way binding([depend on Expression](binding.html#bind)) between the outer component and nested component. In fact, the `current={current}` equals

  ```javascript
    this.$bind(pager, 'current', 'current')
  ```
4. a little similar with [element's event](../core/event.md), the `on-*` attribute will proxy specified event in nested component to outer component. Expression and Non-Expression is all valid.
  
  __example__

  ```html
  <pager on-nav='nav' />
  <pager on-nav={this.nav($event)} />

  ```


## nested component with transclude

In angular, we call the htmlContent inside the directive `transclude html`. 

In regularjs, the `transclude html` is the htmlContent inside the component-tag, for example: 

```html
<modal title=>
  <p>please enter your username</p>
  <input type="text">
</modal>
```

you can use `<r-content>` to place the `transclude-html`.


__Exmaple__


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

Then use this `modal` in other component.

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

var app = new App({data: {title: "hahaha"}}).$inject('#app');
```

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/4wuDZ/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


> <h5>TIP</h5>
> the context of `transclude-html` is the outer component('app' in  example above). so you can call the method at outer component.


---------------------------------------




