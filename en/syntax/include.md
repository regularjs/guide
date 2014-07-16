# Dynamic Include


__Syntax__

```xml
{{#include template}}
```

__where__

* template: A Expression that evaluated to String

`include` watch the passed template, once the changing be detected, template will be recompile. this feature provide two basic advantage.

1. pass partial as param at the initialize time.
2. modify the template structure dynamically

for example, the part of modal's content is changeable,  so we can define the structure of content by using `{{#include}}`.


__Example__


```html
<div id="app"></div>

<!-- Templates -->
<script id="modal" type="text/regular" name='modal'>
  <div class="modal show {{clazz}}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" on-click={{this.close()}} data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">{{title}}</h4>
        </div>
        <div class="modal-body">
          {{#include this.content || content }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" on-click={{this.close()}} >Close</button>
          <button type="button" class="btn btn-primary" on-click={{this.confirm()}}>Confirm</button>
        </div>
      </div>
    </div>
  </div>
</script>

<script>
var Modal = Regular.extend({
  template: '#modal',
  init: function(){
    if(!this.parent) this.inject(document.body)
  },
  close: function(){
    this.$emit('close');
    this.destroy();
  },
  confirm: function(){
    this.$emit('confirm', this.data);
    this.destroy();
  }
});

var modal = new Modal({
  data: {
    content: '<input type="email" class="form-control" r-model={{email}} on-enter={{this.confirm()}}>',
    title: 'please confirm your email'
  }
});

modal.$on('confirm', function(data){
  console.log(data.email)
});

</script>
```

[|DEMO|](http://fiddle.jshell.net/leeluolee/Xvp9S/)


beacuse there is a compelete compiling process on template. so you can use all feature(e.g. `interpolation`, `directive`) 



