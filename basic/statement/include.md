# 片段渲染 - include

include语句可用来引入动态的渲染片段

__Syntax__

`{#include template} `

* __template__`<Experssion>` : 求值结果是 String 或 AST



## 基本使用


## 引入body型片段

## 引入子模板

> 原理
动态引入会监听传入表达式template的数据变动, 每当变化时会重新编译template,并插入到制定位置, 它带来几个好处

1. 可以配置部分模板内容
2. 可以动态修改展现

其中1的意义要远大于2, 比如你实现一个modal弹窗组件，通常modal结构是固定的, 而内容区通常需后续指定, 这时候`include`就可以大展伸手了



```html
<div id="app"></div>

<!-- Templates -->
<script id="modal" type="text/regular">
  <div class="modal show {clazz}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" on-click={this.close()}>×</button>
          <h4 class="modal-title">{title}</h4>
        </div>
        <div class="modal-body">
          {#include content }
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-default" 
            on-click={this.close()} >Close</button>
          <button 
            type="button" 
            class="btn btn-primary" 
            on-click={this.confirm()}>Confirm</button>
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
    content: '<input type="email" class="form-control" r-model={email}>',
    title: 'please confirm your email'
  }
});

modal.$on('confirm', function(data){
  console.log(data.email)
});
</script>



```

[【DEMO】](http://fiddle.jshell.net/leeluolee/Xvp9S/)
