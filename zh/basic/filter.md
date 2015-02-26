# 过滤器Filter

regularjs通过[filter函数]({{ref}}?api-zh#filter)来定义一个过滤器.



__Example__

定义一个join过滤器

```js
Regular.filter('join', function( value, splitor ){
   return value.join(splitor || "-"); 
})
``` 


过滤器在regularjs中使用, 与常规模板并无不同:

```html
<p>{ [1,2,3] |join: "+" } = 6</p>
```

output

```html
<p>1+2+3 = 6</p>
```


## 双向过滤器

regularjs支持一个简单的概念: 双向过滤器.它 主要是帮助我们实现数据的对流, 对任意数据读或写操作时可以进行过滤操作

细节我不再描述， 它在[API文档中]({{ref}}?api-zh#two-way-filter)有详细说明. 






