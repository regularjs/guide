#Template Syntax

Unlike dom-based template like [angular](https://angularjs.org/), [vuejs](vuejs.org), [knockoutjs](http://knockoutjs.com/). regularjs is string-based (e.g. [ractive](http://www.ractivejs.org/)), this featrue provide some advantage.

### 1. more powerful logic function
  
The dom-based template always rely on 
directive(`ng-if`,`ng-repeat`) to implement logic function. it is no possible to 
```html
{{#list users as user}}
  Mr <b>{{user.firstName}} {{user.lastName}}</b><a href="#">DELELE</a>
{{/list}}
```

### 2. only render the parts really need to
  
  The dom-based template like angular dont have own parsing phase, they put the string to the document, and walker the generated dom-node to act the __LINK__ operation, so the node always have some placeholder-information. for example

  ```html
  <button ng-click="save()" ng-disabled="myForm.$invalid"
          class="btn btn-primary">Save</button>
  <button ng-click="destroy()"
          ng-show="project.$remove" class="btn btn-danger">Delete</button>
  ```

  But string-based template have own parsing phase, they can extract the information from parsed AST, and then put the rendering part to the document. so if the dom above is rendered by regular, the result will be:

  ```html
  <button class="btn btn-primary">Save</button>
  <button class="btn btn-danger">Delete</button>
  ```
  beacuse all process is already done in intialize phase with the parsed AST.
  

### 3. making the pre-parsing possible

you can pre-parse the template-string to AST before creating your Component.

__for example__

```html
{{#list items as item}}
  <div class="m-item" on-click={{this.del(item)}}> {{item.name}} </div>
{{/list}}
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

it just __valid json format__, so the parsed ast can send from server to client. 









