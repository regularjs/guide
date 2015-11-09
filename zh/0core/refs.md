## 节点和组件引用

在模板中，你可以使用`ref`属性来标记一个节点或组件。　在组件初始化后，你可以通过component.$refs 来获取你标记的节点


```html

component = new Regular({
  template: "<input ref=input> <pager ref=pager></pager>"
})

component.$refs.input // -> the input tag
component.$refs.pager // -> the pager component

```