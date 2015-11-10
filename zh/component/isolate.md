# 组件隔离

其实之前在对比[组件基础篇](basic/compoennt.md)介绍的两种初始化方式，我隐瞒了它们的一个巨大区别。

__内嵌组件__ 会默认形成『它与上层组件之间的数据绑定关系』，比如


```js
<input r-model={total} type=number/>
<pager total={total}></pager>
```


即我在上层组件修改一份数据会导致pager也进行了脏检查，而pager发生数据变化也会引起上层组件发生脏检查，这在有些时候不是我们想看到的，也会影响到组件的整体性能。我们或许希望pager与上层组件完全隔离，而完全通过事件来通信。

## 组件的isolate属性


`isolate`可以实现上述要求，例如上例如果修改为:

```js
<input r-model={total} type=number/>
<pager total={total} isolate on-nav='nav'></pager>
```

那内嵌组件pager与实际就是完全隔离了，完全等同于JS初始化`new Pager().$inject('input', 'after')`。


