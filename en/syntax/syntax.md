## Syntax

regular's template only have two types of syntax:  `xml` and `jst`, they have different lexical process.

### 1. xml

just like `html` we used everyday

__Example__

```javascript
<div class="m-tag">
 Hello, world
</div>
```


### 2. jst

jst is the section wrapped by the opentag(default: `{`) and close_tag (default: `}`). it contains interpolation (`{}`) and rule `{#}`

jst is similar to freemarker(http://freemarker.org/) (the opentag and closetag is changed but is configurable).



__Example__

```xml
{#if user.type === 1}
  <p>{user.name}</p>
{/if}
```


## About Rule

in regular, `{#}` is consider as rule.

There are already some built-in rules like `{#if}` `{#else}` `{#elseif}` `{#list}` `{#include}`.

just like xml, rule's tag must be matched or self closed.



### Why not use mustache-syntax

* mustache doesn't support [Expression](expression.md).

* mustache doesn't support rule, which is an important syntax enhancement.


### Some Tips

1. rule and xml must dont breakup with each other, which is the most important difference between regularjs and other string-based templates.

  ```xml
  <div>
  {#if true}
    True
  </div>
  {#else}
    False
  </div>
  {/if}

  ```

 the example above is invalid.

--------------------------

-

