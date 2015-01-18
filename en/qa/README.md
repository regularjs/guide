# Q & A 


#### 1. Why [Expresion] and [String] are valid in most builtin directive?

some builtin directive like `r-html` can accept both [String] and [Expression] as its param. 

__Example__


```html

<div r-html="content"></div>
<div r-html={content}></div>

```

Beacuse they all use the [`$watch`](../core/binding.html#watch) to create binding between innerHTML and the data. Just like we talked before, the `$watch` will convert __not-expression__ to [Expression] by using `Regular.expression(String expr)`. 




However, you can also make them do differrent things(see [`event`](../core/event.md)). for example, you need directly assign the node.innerHTML when passed param is not [Expression]

```javascript
Regular.directive('r-html', function(elem, value){
  if(value.type !== 'expression'){ // not Expression
    elem.innerHTML = value;
  }else{
    this.$watch(value, function(newValue){
      elem.innerHTML = newValue;
    })
  }
})
```

__It all depends on you__.






> ####the real difference between [Expression] and [String] 
Expression is parsed during the parse phase(string -> ast), but the [String] need to parse in Runtime(Compile phase) . so it is a good idea use [Expression] in template if you need to create binding.