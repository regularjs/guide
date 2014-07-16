## Syntax 

regular's template only have two types of the syntax  element,  `xml` and `jst`. they have different lexical process.

### 1. xml

just like `html` what we used everyday

__Example__

```javascript
<div class="m-tag">
 Hello, world 
</div>
```


### 2. jst

jst is the section wrapped by the opentag(default: `{{`) and close_tag (default: `}}`). it contains inteplation (`{{}}`) and rule `{{#}}`

jst is similar with freemarker(http://freemarker.org/) (the opentag and closetag is changed but is configurable).



__Example__

```xml
{{#if user.type === 1}}
  <p>{{user.name}}</p>
{{/if}}
```


## About Rule

in regular, `{{#}}` is consider as rule.

There are already some built-in rules like `{{#if}}` `{{#else}}` `{{#elseif}}` `{{#list}}` `{{#include}}`. 

just like xml. rule's tag must be matched or self closed. 



### Why not use mustache-syntax

* including [Expression](expression.md) support.

* easily syntax enhancement based rule.


### Some Tips

1. rule and xml must dont breakup each other which is the most important difference from regularjs to other string-based template

  ```xml
  <div>
  {{#if true}}
    True
  </div>
  {{#else}}
    False
  </div>
  {{/if}}

  ```

 the example a above is invalid.

--------------------------

-

