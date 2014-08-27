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

app.$inject('#app')
  .$update('username', 'regularjs') //update the data

```



## 属性节点插值


对于属性节点插值，情况就要复杂一些了. regular 目前允许值被插值, 这里面有几个说明要点.

1. 具有插值的字符串如`"m-modal m-modal-{{klass}}"`会生成一个表达式，求值结果是这个字符串计算后的值

2. 对于非指令类的的属性, regularjs会在绑定的值发生变化时, 修改对应属性

3. 对于指令类的属性(包括事件、动画等), 会将插值表达式传入[directive](../core/directive.md)的处理函数中, 具体处理交由directive指令

鉴于此, 其实`style`, `class`等天生就具有插值能力

__Example__

```javascript

<input
  type='radio'
  on-click={{disabled = true}}
  class={{klass}}
  r-model={{checked}}
  style="left: {{10 + offsetX}}px; top: {{10 + offsetY}}px"

```

1. `r-model`: 指令
2. `style`: 字符串插值
3. `class`: 简单属性插值
4. `type`:  未插值属性
4. `on-click`: 事件指令
















