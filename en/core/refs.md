## reference

you can use the attribute `ref` to mark a reference to node or component. after compiling the template . you can use `component.$refs` to find the marked node or component


```html

component = new Regular({
  template: "<input ref=input> <pager ref=pager></pager>"
})

component.$refs.input // -> the input tag
component.$refs.pager // -> the pager component

```