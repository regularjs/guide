
# 常见问题


## 如何与NEJ UMI系统集成

很多网易同事应该没有直接使用Regular的SPA解决方案[regular-state]

请参考[ISSUE: NEJ UMI的集成 #17 ](https://github.com/regularjs/guide/issues/17)



## Regular的性能(or 脏检查的性能)

Regular 由于脏检查的存在，需要一些额外的 [__注意事项__](../topic/performance.md) 来达到更好的性能表现。

但在某些情况下，比如 __数据全替换场景且页面节点较多__ 时的频繁更新表现是优于一些竞品框架的，
比如fork自 https://github.com/mathieuancelin/js-repaint-perfs 的这个Case

- vue2: http://mathieuancelin.github.io/js-repaint-perfs/vue2/
- react: http://mathieuancelin.github.io/js-repaint-perfs/react/
- regularjs: http://mathieuancelin.github.io/js-repaint-perfs/regularjs/
 
在我的电脑上(MacBook Pro 15: 2.2 GHz Intel Core i7、16 GB 1600 MHz DDR3)，三者的fps数据大致是

```js
Vue2: 55 ~ 65
React: 80 ~100
Regular: 130 ~ 140
```

当然这个场景是明显的对Vue不利，因为Vue的数据是有状态的，全量替换数据需要重新建立依赖关系。
举这个例子，只是为了反驳很多开发者无条件的认为Vue的性能是无可反驳的第一。
由此可见，一个框架很难在所有场景做到表现最好，如果你发现Regular有性能表现特别差的场景，欢迎报Issue给我。

