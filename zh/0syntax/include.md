# 动态引入


__Syntax__

```xml
{#include template}
```

__where__

* template: A Expression that evaluated to String


动态引入会监听传入表达式template的数据变动, 每当变化时会重新编译template,并插入到制定位置, 它带来几个好处

1. 可以在初始化时再输入模板内容
2. 可以动态修改展现

其中1的意义要远大于2, 比如你实现一个modal弹窗组件，通常modal结构是固定的, 而内容区通常需后续指定, 这时候`include`就可以大展伸手了


__Example__


```html
<div id="app"></div>

<!-- Templates -->
<script id="modal" type="text/regular" name='modal'>
  <div class="modal show {clazz}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" on-click={this.close()} data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">{title}</h4>
        </div>
        <div class="modal-body">
          {#include this.content || content }
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" on-click={this.close()} >Close</button>
          <button type="button" class="btn btn-primary" on-click={this.confirm()}>Confirm</button>
        </div>
      </div>
    </div>
  </div>
</script>

<script>
var Modal = Regular.extend({
  template: '#modal',
  init: function(){
    if(!this.parent) this.$inject(document.body)
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
    content: '<input type="email" class="form-control" r-model={email} on-enter={this.confirm()}>',
    title: 'please confirm your email'
  }
});
modal.$on('confirm', function(data){
  console.log(data.email)
});
</script>
```


[|DEMO|](http://fiddle.jshell.net/leeluolee/Xvp9S/)

动态引入的强大之处就是由于是对content进行的重新编译所以可以进行插值以及指令绑定等等操作,与直接描述在模板中是一样的.