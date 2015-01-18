#  if/ifelse/else

You can use if, elseif and else rule to conditionally skip a section of the template. The condition's value will be converted to boolean type. The elseif-s and else-s must occur inside if (that is, between the if start-tag and end-tag). If can contain any number of elseif-s (including 0), and one optionally else at the end.

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
- condition: Expression evaluates to a boolean value



__Example__

```html

{#if user.age >= 80 }
  you are too old
{#elseif user.age <= 10}
  you are too young
{#else}
  Welcome, Friend
{/if}

```


## use `if` with the attribute

you can use `if` `else` `elseif` to control the attribute value.

__Example__

```xml
<!-- control the attribute -->
<div {#if active == 'home'}data-home{/if}>Home</div>
<!-- control the event -->
<a {#if current < last} on-click={this.next()} {/if}>Next</a>

<!-- control the directive -->
<input {#if !disabled} r-model={username} {/if}>
```

If the test is evaluated to false, the attribute, event-handler, directive will be removed or destroyed;




