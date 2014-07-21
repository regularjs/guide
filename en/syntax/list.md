# List

You can use the list rule to process a section of template for each variable contained within a sequence. The code between the start-tag and end-tag will be processed for the 1st subvariable, then for the 2nd subvariable, then for the 3rd subvariable, etc until it passes the last one. For each such iteration the loop variable will contain the current subvariable.


__Syntax__: 

```
{{#list sequence as item}}
  ...block...
{{/list}}

```

__where__

* sequence: Expressions evaluates to a sequence or collection
* item: Name of the loop variable (not an expression)


There are one special loop variables available inside the list loop:

item_index: This is a numerical value that contains the index of the current item being stepped over in the loop(start with 0).


__Example__


```xml
{{#list items as item}}
 <span class='index'>{{item_index}}:</span>{{item}}
{{/list}}


```


### range support

regular is support a special data-type —— range.

__Syntax__: 

```
start..end
```

__where__

* start: A expression evaluted to number means range's start
* end:  A expression evaluted to number means range's end


> `1..3` === `[1,2,3]`

__Example__

```xml
{{#list 1..3 as item}}
  <p>{{item}}</p>
{{/list}}
```

will output `1 2 3`



### Warning

in every iteration, regularjs will create a proxy component, then the `item`, `item_index` can be remained on it. the outer 
component's data reference is based on prototypal inheritance(just like angular). so list have the same disadvantag with angular. on the other hand,  the `this` in list's section is point to outer component, you can use `this` to refer outer component's method or data.

//TODO

__Example__

```xml
<!-- every iteration , regularjs will create a new Component, then the `item`, `item_index` can be remained -->

  
<div>username: {{username}}</div>
<div>user.name: {{user.name}}</div>
<p>LIST</p>
{{#list items as item}}

  <p><a href='#' on-click={{name = name + '1'}}>name = name + '1': <b>not affect</b></a> </p>
  <p><a href='#' on-click={{user.name = user.name + '2'}}>user.name = user.name + '2': affect with Referrence Data Type</a></p>
  <p><a href='#' on-click={{this.changename()}}> this.changename(): affect by call method</a></p>
  <p><a href='#' on-click={{this.data.username= username + "1"}}>this.data.name= name + "1": affect by `this` </a></p>

{{/list}}
```

<iframe width="100%" height="300" src="http://jsfiddle.net/leeluolee/nKK8D/embedded/result,js,html,resources" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

