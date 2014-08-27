#内建模板引擎

与angularjs,vuejs,knockoutjs等基于__[DOM]__的模板框架不同, regularjs的模板是基于__[字符串]__的. 这带来了几个好处:

### 1. 更强细粒度更自由的语法
  
  angularjs, vuejs这类框架的逻辑控制等语法能力普遍都基于directive(`ng-if`,`ng-repeat`)的形式，这就决定了它的最小控制单元是节点，而无法实现以下字符串模板普遍可以实现的书写方式

  ```html
{{#if isLogin}}
<a {{#if isNotFavor}} on-click={{this.favor()}} {{/if}}>Digg</a> <a on-click={{ignored = true}}>Ignore</a>
{{/if}}
  ```

### 2. 生成更纯净的节点
  
  由于angularjs等框架的parse其实是留给浏览器做的，它的directive其实是对已构建出的节点做的link操作，在这种前提下，节点上往往带有很多directive的无用信息，例如

  ```html
  <button ng-click="save()" ng-disabled="myForm.$invalid"
          class="btn btn-primary">Save</button>
  <button ng-click="destroy()"
          ng-show="project.$remove" class="btn btn-danger">Delete</button>
  ```

  其实大部分类似ng-click的信息都无需显示在dom上


  而regularjs的parse是框架内做的，它生成类似AST的中间数据结构(用以生成节点结构)，从而拥有独立compile过程，提取真正需要显示在页面。所以如果使用regularjs，实现类似功能的模板在进入文档时，将会变成

  ```html
  <button class="btn btn-primary">Save</button>
  <button class="btn btn-danger">Delete</button>
  ```
  

### 3. 使得预解析成为可能

与emberjs等基于第三方字符串模板(handlebar)实现数据绑定的框架不同，regularjs依赖的模板解析器是完全内置的，它同时完成了xml 和模板语法的解析，并输出可序列化的AST结构(其中表达式会输出function body，在compile时再进行new Function 组装成)，使得预解析成为可能.

例如

```html
{{#list items as item}}
  <div class="m-item" on-click={{this.del(item)}}> {{item.name}} </div>
{{/list}}
```

将会解析成成这段中间数据结构

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

在编译阶段，会层级遍历此可公用的结构并生成对应的dom结构。


------------------


接下来的几个小节将会详细阐述整个模板的语法特性

