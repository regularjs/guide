
# 列表渲染 - list

list语句用来根据列表或对象选项进行循环渲染。

__Example__

```html
<ul>
{#list sequence as item}
  <li>{item.name}</li>
{/list}
</ul>

```

__说明__

* __sequence__: 求值为数组或对象的表达式
* __item__: 迭代数组元素的别名




## 下标 `{别名}_index`

每次迭代会创建一个名为 __`{别名}_index`__ 的下标别名，下标从 0 开始。

__Example__

```js
const component = new Regular({
  template: `
    {#list items as obj}
        <span class='index'>{obj_index}:{obj}</span>
    {/list}
    `,
  data: {
    items: ["a", "b", "c", "d"]
  }
})

component.$inject(document.body);

```

__输出__

```html
<span class="index">0:a</span>
<span class="index">1:b</span>
<span class="index">2:c</span>
<span class="index">3:d</span>
```

<a id="if"></a>


## `#else`语句展示空状态

嵌入`#else`语句来来展示列表 __为空__ 的情况

> `[]`, `null`, `undefined` 都会视为是空值


__Example__


```html
{#list list as item }
  <div class='item'>{item}</div>
{#else}
  <div class='altnate'> no result here  </div>
{/list}
```


<script async src="//jsfiddle.net/leeluolee/dn87x4yw/embed/js,result/"></script>




## 使用 track语句 加速你的列表渲染


默认条件下，Regular会使用[莱文斯坦编辑距离算法](https://en.wikipedia.org/wiki/Levenshtein_distance)来计算最小变更DOM。

但这个算法的时间复杂度是 <strong>O(n<sup>2</sup>)</strong> ，在列表超过一定数量时(比如 __>100__ )，它的逻辑开销就会明显超过DOM的开销。

所以Regular 提供了`by` 描述符来精确控制DOM的销毁与复用


### 使用

__Syntax__

```js
{#list sequence as item by Expression}

{/list}
```


- Expression: 任意表达式(如`item.id`)，__⚠️记得每个迭代的表达式求值应该是唯一不重复的__



__Example__


<script async src="//jsfiddle.net/leeluolee/zmp6y91s/embed/js,result/"></script>


### by 下标


最常用的场景就是直接track下标,这种在内部是最快的实现，因为没有任何排序和对比开销。

<script async src="//jsfiddle.net/leeluolee/wh0n4bq3/embed/js,result/"></script>


### 注意点

- track复用的节点不会重新调用组件的生命周期流程（`config`、`init`)，只是简单的更新迭代别名对应的值。
- ⚠️track不能应用在对象的列表渲染中，因为对象本质是无序的。
- 在超大列表下，尽可能的使用下标track，达到最佳的性能效果。



## 对象的列表渲染

Regular 支持对象类型的列表渲染渲染


### 键的别名变量 `{别名}_key`

在对象的列表渲染中，假设循环别名是`item`, 各别名的意义分别是

- `item`: 迭代的对象值
- `item_key`: 迭代的对象键
- `item_index`: 迭代的下标

__Example__

<script async src="//jsfiddle.net/leeluolee/gth68n9p/embed/js,result/"></script>

### 解决对象渲染无法track

上节提到了对象是无法进行track的，你可以先将其转换为有序, 再使用track描述

<script async src="//jsfiddle.net/leeluolee/u6fbzx2L/embed/js,result/"></script>


> 也可以在JS中转换为数组

## 要点提示


- 与其它语句一样，list语句包裹的结构[不受单节点限制](./#wrap-limit)

