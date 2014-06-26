# 插值

插值是regular中最常用的部分，如下例

```html
<p class="m-modal m-modal-{{klass}}" on-click={{this.remove(user)}}> 
  {{user.name}} 
</p>

```

可以发现插值可以发生在__文本节点__，也可以在__属性节点__.


## 文本插值

对于文本插值, regular仅仅只是创建一个textNode,并插入到制定位置, 并建立与插值表达式的单向数据绑定.

__Example__

```js
// you can just use Regular to create non-reusable component
var app = new Regular({
  template: "<div>{{username}}</div>",
  data: {username: 'leeluolee'}
});

app.inject('#app')
  .$update('username', 'regularjs') //update the data

```



## 属性节点插值



对于属性节点插值，情况就要复杂一些了. regular 目前只允许属性值可以被插值, 这里面有几个说明要点.

1. 具有插值的字符串如``

1. 直接的插值
  对于非directive(指令类的)的属性, 例如: `class`、`title`等属性你一般不会去定义插值. regular会

2. 字符串插值



__Example__











