# 内嵌内容(transcluded content)


## 什么是内嵌内容

内嵌内容即被当前节点包裹的内容， 例如

```html
<ul>
    <li>One</li>
    <li>Two</li>
</ul>

```

`ul`的内嵌内容就是

```html
    <li>One</li>
    <li>Two</li>
```

这个很好理解， 对于组件而言, 内嵌内容也是一样， 即__被组件标签所包裹的内容__. 

```html
<modal on-confirm={this.ok()}>
    <p>Please input your password!!</p>
</modal>
```
其中`<p>Please input your password!!</p>`即为组件modal的内嵌内容, 

## 组件的内嵌内容

上几节， 我们学习了内嵌组件的用法， 不过一般都是这么用

```html
<modal ></modal>
<!-- or self-closed  -->
<pager current={current} />
```

这种使用方式非常直观， 因为一般来讲， 组件是由一段封闭的html和输入(data) 构成. 这种方式可以达到使用javascript创建和模板中声明达到一致性.


## 如何使用组件的transclude内容?

写在组件标签上的属性，即会成为组件data上得对应字段(如果是表达式， 还是形成绑定), 



## 小节

如果需要完整的理解， 如何使用内嵌内容， 推荐看下[使用regularjs创建Tabs组件](../guide/tabs.md)这一节.