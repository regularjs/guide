# 如何优雅的管理你的模板

regularjs并不处理模板的加载等， 你只需要保证传给template的值是个字符串或者是预解析的AST即可. 

本文会涉及到的内容有:

- 简单管理方案
    1. 直接字符串拼接
    2. 在容器节点中保存模板
    3. 使用ES6或Coffee本身的多行字符串， 一种Trick在当前ES5或ES3下使用多行字符串
- 支持预解析的方案
    1. requirejs的`rgl`插件
    2. browserify的`rgl`以及`rglc` transform
    3. NEJ的`regular!`插件
- 使用Regular.parse实现自己的模板管理支持


## 简单管理方案


在regularjs提供的所有例子中，为了方便起见, 基本都使用了以下两种方式来管理你的模板:

1. 直接在js中声明模板字符串
  
  ```js
  var Component = Regular.extend({
    tempalte: "<h2>{title}</h2>"
  })
  ```

  当模板非常简单时，这样做确实非常方便，

  当模板结构稍微复杂点时, 一般也可以使用页面的模板容器节点
2. 引用实现写在页面标签中的内容，如 

  ```javascript
  var Component = Regular.extend({
    tempalte: document.getElementById("app")
  })

  ```

  在`#app`节点(一般是修改了type的script标签， 即不会render其中内容的容器):

  ```html

  <script id='app' type='text/rgl'>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
      //...
       </div>
    </div>
  </nav>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-3 col-md-2 sidebar">
      //...
      </div>
    </div>
  </div>
  </script>
  ```
  这种方式相较于方式1其实有利有弊. 例在于它解决了在js中拼接字符串模板的肮脏行为, 弊则在于模板本身变成了一个“全局”的东西，组件这个统一的整体也被打碎了, 从项目规模庞大后，维护这些散落在页面中的容器节点也会成为随时引爆的导火索
3. 使用multiline书写多行字符串. 
    
    大家都知道未来的ES6和Coffeescript一样都可以书写多行字符串， 比如

    ```js
    var template = 
        `
        <h2></h2>
        <div class="container">{content}</div>
        `
    ```

    但是在ES6还未普及的今天， 其实也有一种小技巧来帮助我们书写多行字符串——[sindresorhus/multiline](https://github.com/sindresorhus/multiline)

    你可以这样来声明一个多行字符串 

    ```js
    var str = multiline(function(){/*
    <!doctype html>
    <html>
        <body>
            <h1>❤ unicorns</h1>
        </body>
    </html>
    */});
    
    ```


但是， 上述几种种解决方案都有一个问题： __无法对模板做预解析. __

“是否有解决上述问题的方案呢？” 答案是肯定的, 就是将模板加载集成到模块系统中， regularjs 提供了市面上最常用的两种开发方式的解决方案: requirejs(AMD) 和 browserify(Commonjs), 

## 依托与模块系统的方案

### [requirejs-regular](https://github.com/regularjs/requrejs-regular)

__Install__

- `bower install requirejs-regular`
- `npm install requirejs-regular`


__Introdocution__


使用`rgl!`前缀来标明此资源为regularjs模板, 会在加载的同时将其解析为ast.




__Example__

```js

require(['rgl!foo.html', 'regularjs'], function(foo, haha , Regular){

    var Foo = Regular.extend({
      template: foo
    })

    return Foo;

});
```


点击 [https://github.com/regularjs/requirejs-regular](https://github.com/regularjs/requirejs-regular) 查看requirejs的使用和optimizer的配置




### regularify (browserify)


reuglarjs 提供一个 browserify 的 transform ([regularify](https://github.com/regularjs/regularify) ) 用来转换模板


__Install__

- `npm install regularify`


__Usage__

You can simply use extensions `.rgl` and `.rglc`(they do different transform) to load regularjs template or component, the extensions are also configurable



__use `.rgl`__

transform rgl is used to load rgl template

```html
var ast = require("xx.")

var Component = Regular.extend({
  template: ast,
  // ....
})

```


__use `.rglc`__

transform rglc is used to load A reuglarjs Component.

```html
var Component = require("component.rglc")
```

where in `component.rglc`

```html
<h2>{title}</h2>
<div>{content}</div>

<script>
  module.exports = {
    init: function(){

    }
  }
</script>

```

See [regularify](https://github.com/regularjs/regularify) for more information



### NEJ
特别对于网易的同事， regularjs目前已经集成到[NEJ](http://nej.netease.com)得模块体系中， 使用中有疑问可以私泡我 (杭州研究院|前台技术中新|郑海波)




## 不使用requirejs或browserify，怎么办? 

如果以上两种模块体系都是不是你得选择，也许你需要自己实现一个处理插件了， 不用担心由于regularjs本身本打包为了umd模块，它可以同时在node和browser环境被使用。
使用 [Regular.parse](?api-zhparse)来处理你的模板字符串吧， 具体可以参考requirejs-regular 和 regularify的实现

```html
var Regular = require("regularjs");

var AST = Regular.parse("{title}", {
  BEGIN: '{',
  END: '}'
})

```