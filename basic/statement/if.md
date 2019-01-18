
# 条件渲染 - if


Regular提供了`if`，`elseif`，`else`等语法元素来做条件渲染的控制

__Syntax__


```html
{#if condition}
...
{#elseif condition2}
...
{#else}
...
{/if}
```


__说明:__

- condition: 判断条件Expression，这个表达式结果会被强制转换为Boolean值


__Example__

```html

{#if user.age >= 80 }
  you are too old
{#elseif user.age <= 10}
  you are too young
{#else}
  Welcome, Friend
{/if}

```

<script async src="//jsfiddle.net/leeluolee/km05avj8/embed/js,result/"></script>



## if 语句不是条件渲染的银弹

在Regular内部，if语句在每次切换时会回收掉隐藏的部分，创建需要展示的部分。某些场景用其它方案做条件渲染会更高效。

### 表达式 还是 if语句？


其实上例可以修改为用表达式 `this.getInfo(user.age)`，这样的开销更少，而且复杂逻辑抽离到JS中，会让模板更清晰。


<script async src="//jsfiddle.net/leeluolee/3uhLq24n/embed/js,result/"></script>


### r-hide 还是 if语句?

Regular 提供了 [r-hide](../../reference/directive.html#r-hide) 指令用来控制节点的`display`属性，实际上也能做到条件渲染。

有几个建议，你参考是选择 `r-hide` 还是 `if语句`

- 如果控制展示区域不复杂或者有高频率控制展示隐藏的部分，请选择`r-hide`，这样可以避免重复的回收/创建开销。
- 其它情况请选择`if语句`，因为if语句会将整个区域都进行回收，对内存会比较友好



## 要点提示

- 与其它语句一样，if语句包裹的结构[不受单节点限制](./#wrap-limit)

