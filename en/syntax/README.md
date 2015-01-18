> <b>After version 0.3.0: regularjs change the default TAG from `{{}}` to `{}`</b>, please use `Regular.config({BEGIN:'{{', END: '}}'})` if you need the old syntax`

#Template Syntax

Unlike dom-based template such as [angular](https://angularjs.org/), [vuejs](vuejs.org), [knockoutjs](http://knockoutjs.com/), regularjs is string-based (e.g. [ractive](http://www.ractivejs.org/)), this feature provides some advantages:

### 1. more powerful control over logic

The dom-based template always rely on
directive(`ng-if`,`ng-repeat`), so the logic is element-based, they can't describe the structure like this:
```html
{#if isLogin}
<a {#if isNotFavor} on-click={this.favor()} {/if}>Digg</a> <a on-click={ignored = true}>Ignore</a>
{/if}
```

in fact, you can use use the `logic` to controll the `directive` and `event`.


### 2. only render the parts that really need to

  The dom-based template like angular don't have its own parsing phase, they just put the string into the document, and walker the generated dom-node to call the __LINK__ action, so the node always have some placeholder. for example:

  ```html
  <button ng-click="save()" ng-disabled="myForm.$invalid"
          class="btn btn-primary">Save</button>
  <button ng-click="destroy()"
          ng-show="project.$remove" class="btn btn-danger">Delete</button>
  ```

  But string-based template have its own pasing phase, they can extract the information from parsed AST, and then put the rendered content into the document. If the dom above is rendered by regular, the result will be:

  ```html
  <button class="btn btn-primary">Save</button>
  <button class="btn btn-danger">Delete</button>
  ```
  , beacuse all processes are already done in intialize phase with the parsed AST.


### 3. making the pre-parsing possible

you can pre-parse the template-string to AST before creating your Component.

__for example__

```html
{#list items as item}
  <div class="m-item" on-click={this.del(item)}> {item.name} </div>
{/list}
```

will be parsed to

```javascript
[
  {
    "type": "list",
    "sequence": {
      "type": "expression",
      "body": "_d_['items']",
      "constant": false,
      "setbody": "_d_['items']=_p_"
    },
    "variable": "item",
    "body": [
      {
        "type": "text",
        "text": "  "
      },
      {
        "type": "element",
        "tag": "div",
        "attrs": [
          {
            "type": "attribute",
            "name": "class",
            "value": "m-item"
          },
          {
            "type": "attribute",
            "name": "on-click",
            "value": {
              "type": "expression",
              "body": "(typeof (_c_['del']) !=='function'?_c_['del'](_d_['item']):_c_['del'].call(_c_,_d_['item']))",
              "constant": false,
              "setbody": false
            }
          }
        ],
        "children": [
          {
            "type": "text",
            "text": " "
          },
          {
            "type": "expression",
            "body": "_d_['item']['name']",
            "constant": false,
            "setbody": "_d_['item']['name']=_p_"
          },
          {
            "type": "text",
            "text": " "
          }
        ]
      }
    ]
  }
]
```

It is just __valid json format__, so the parsed ast can be sent from server to client.









