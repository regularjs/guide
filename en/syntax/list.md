# List

You can use the list rule to process a section of template for each variable contained within a sequence. The code between the start-tag and end-tag will be processed for the 1st subvariable, then for the 2nd subvariable, then for the 3rd subvariable, etc until it passes the last one. For each such iteration the loop variable will contain the current subvariable.


__Syntax__: 

```
{#list sequence as item}
  ...block...
{/list}

```

__where__

* sequence: Expressions evaluates to a sequence or collection
* item: Name of the loop variable (not an expression)


There are one special loop variables available inside the list loop:

item_index: This is a numerical value that contains the index of the current item being stepped over in the loop(start with 0).


__Example__


```xml
{#list items as item}
 <span class='index'>{item_index}:</span>{item}
{/list}


```


### range support

regular support a special Type —— range.

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
{#list 1..3 as item}
  <p>{item}</p>
{/list}
```

will output `1 2 3`




