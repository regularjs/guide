# 语句


rgl 除了插值和表达式之外的语法元素就只有语句


__Syntax__

`{#NAME ...}Block..{/NAME}`

或者自闭合语句

`{#NAME /}`



目前 rgl 中只有三类语句: [list](./list.md), [if/else/elseif](./if.md) 和 [include](./include.md)，未来也会通过相同的语法来进行扩展


##😀 迭代的结构不受节点限制  {#wrap-limit}

与大部分其它框架不同的是，__包裹在rgl语句包裹结构不限制一个唯一节点内__ ，如下例的list语句

```js
new Regular({
  template: `
  {#list items as item}
    {item_index}-<a>{item.name}</a><br/>
  {/list}
  `,
  data: {
    items: [{
        name: 'Apple'
      },
      {
        name: 'Android'
      },
      {
        name: 'Windows'
      }
    ]
  }
}).$inject(document.body)

```

<script async src="//jsfiddle.net/leeluolee/npsthb45/embed/js,result/"></script>


## ⚠️ Regular中 语句和XML标签是不能被相互打断的#



__😔错误️__

```xml
<div>
{#if true}
  <p>True</p>
</div>
{#else}
  <p>False</p>
</div>
{/if}

```

__😀正确__

```xml

<div>
{#if true}
  <p>True</p>
{#else}
  <p>False</p>
{/if}
</div>

```


