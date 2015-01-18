# 逻辑控制 if/ifelse/else

与其它模板引擎(如freemarker)一样, regular也提供了`if`,`elseif`,`else`等语法元素提供对逻辑控制的支持

__Syntax__


```xml
{#if condition}
  ...
{#elseif condition2}
  ...
{#else}
  ...
{/if}
```

where:
- condition: 一个计算为bool值的表达式(非bool值会被转换)


__Example__


```mustache
{#if user.age >= 80 }
  you are too old 
{#elseif user.age <= 10}
  you are too young
{#else}
  Welcome, Friend
{/if}
```

这里的`you are too old`等都称之为block(块) 根据判断表达式是否为真, 判断是否显示某个block或让某个block回收. 


> 在regular中，`{#NAME }{/NAME}`开头的被视为内建规则的开始，就如`<NAME>`之于html


## 用 `if` 控制属性(包括指令、事件、常规属性)

__Example__

```html
<!-- control the attribute -->
<div {#if active == 'home'}data-home{/if}>Home</div>
<!-- control the event -->
<a {#if current < last} on-click={this.next()} {/if}>Next</a>

<!-- control the directive -->
<input {#if !disabled} r-model={username} {/if}>
```

如果表达式为真，属性指令等会被添加到节点，反之会被回收，这个如果是dom-based 模板，你显然无法简便的实现。






