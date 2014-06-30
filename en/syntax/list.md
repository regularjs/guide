# 循环控制list

list指令用来遍历某个sequence来循环的处理某些重复性的结构

list内建规则

__Syntax__: 

```
{{#list sequence as item}}
  ...block...
{{/list}}

```

__where__

* sequence: Expressions evaluates to a sequence or collection
* item: Name of the loop variable (not an expression)



在每次循环都会创建一个loop临时变量

* `item_index`(取决于你的item命名): 代表当前遍历到的下标(从0开始, 类似与angular中的`$index`变量) 


__Example__
| 

```xml
{{#list items as item}}
 <span class='index'>{{item_index}}:</span>{{item}}
{{/list}}


```


### Range支持

regular同时也支持一个特殊的表达式类型range, 用来创建一个有序的数字数组

__Syntax__: 

```
start..end
```

__where__

* start: 一个代表数字序列开始的表达式
* end:  一个代表数字序列结束的表达式


> `1..3` === `[1,2,3]`

__Example__

```xml
{{#list 1..3 as item}}
  <p>{{item}}</p>
{{/list}}
```

will output `1 2 3`



###注意点

list内部实现会在每次iterate时与angular类似会创建一个新的匿名组件(类似于ng-repeat中创建的子scope), 对外层数据的访问是通过原型继承的方式，所以修改原始类型的数据如字符，将不会对父组件产生影响，你可以通过引用类型的属性或函数调用来避免这个缺陷, 其中`this`对象仍然指向外层组件

__Example__

```xml
<!-- every iteration , this block will create a new Component, then the `item`, `$index` can be remained -->

{{#list items as item}}
{{$index}: {{item.context}}}
<a on-click={{name = 1}}>not affect outer</a>  no affect outer;
<a on-click={{user.name = 'haha'}}>affect outer</a> can affect outer
<a on-click={{this.change(user)}}>call function</a> call outer component, and context also at outer component 
{{/list}}
```