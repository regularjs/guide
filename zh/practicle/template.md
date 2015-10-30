# 如何优雅的管理你的模板

作为一个『库』, Regular肯定不会涉及到模板的加载， 你只需保证传给`template`的值是个__字符串__或是__预解析AST__即可. 

> 也就是说, 所有可以加载纯文本的方式都可以用来加载Regular的模板.

Regularjs本身已经提供了尽可能多的方式来方便你在不同的场景下都能管理你的模板.

方案清单:

- 简单方案
    1. [直接字符串拼接](#raw)
    2. [在容器节点中保存模板](#script)
    3. [依托ES6或Coffeescript的多行字符串](#mult)
- 与模块化工具结合的方法
    1. [webpack](#webpack)
    2. [browserify](#browserify)
    3. [NEJ](#nej)
    4. [requirejs](#requirejs)
- 使用Regular.parse实现解析插件


## 简单管理方案


在regularjs提供的所有例子中，为了方便起见, 基本都使用了以下两种方式来管理你的模板:

<a name="raw"></a>

1. 直接在js中声明模板字符串
  
  ```js
  var Component = Regular.extend({
    tempalte: "<h2>{title}</h2>"
  })
  ```

  当模板非常简单时，这样做确实非常方便，

  当模板结构稍微复杂点时, 一般也可以使用页面的模板容器节点

2. 引用实现写在页面标签中的内容，如 <a name="script"></a>

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
  这种方式相较于方式1其实有利有弊. 例在于它解决了在js中拼接字符串模板的肮脏行为, 弊则在于模板本身变成了一个「全局」的东西，组件这个统一的整体也被打碎了, 从项目规模庞大后，维护这些散落在页面中的容器节点也会成为随时引爆的导火索
3. 使用多行字符串 <a name="mult"></a>
    
    大家都知道ES6和coffee都可以直接使用多行字符串，免去了字符串拼接的开销

    __ES6__

    ```js
    var template = `
      <h2></h2>
      <div class="container">{content}</div>
      `
    ```

    > 鉴于现在ES6的打包工具普及度非常高， __非常推荐开发者直接使用ES6进行开发__

    对于ES5或ES3，其实也有一种小技巧来帮助我们书写多行字符串——[sindresorhus/multiline](https://github.com/sindresorhus/multiline)

    你可以这样来声明一个多行字符串 

    ```js
    var str = multiline(function(){/*
      <div>
          <h1>❤ unicorns</h1>
      </div>
    */});
    
    ```

    __但是！！，不建议大家在实际项目中使用这种提取注释的方式来书写__，因为注释是可能会被压缩工具移除的.


上述简单管理方案都有自己的痛点, 并且都有通病: 无法对模板做预解析.

> 『 是否有解决上述问题的方案呢？』

答案是肯定的, 即将模板作为一种资源集成到模块系统中



## Regular模板与模块系统结合

下面会介绍Regular与市面上常见模块系统的结合方案, 它们分别是

- [webpack](): ES6 或 Commonjs 或 AMD (一统浆糊)
- [broswerify](): Commonjs
- [NEJ](http://nej.netease.com): 类AMD规范( 网易杭州的前端模块规范 )
- [requirejs](http://requirejs.org): AMD

> 本文只是介绍如何将Regular集成进这些系统中，而不是普及这些模块系统的使用方法，请大家自行学习.




<a name="webpack"></a>
### webpack

webpack是近年来兴起的当红炸子鸡，支持多种模块规范共存，支持增量编译, 社区强大. __作者非常推荐直接使用ES6 + webpack的方式__来开发你的项目.

webpack对于非内建模块支持，是通过[自定义loader](https://webpack.github.io/docs/loaders.html)的方式. 

__✨所有DEMO可以在[regularjs/example](https://github.com/regularjs/example#webpack)__ 找到范例

__配置__

```js
var path = require('path');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname ,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "raw" },
            { test: /\.rgl$/, loader: 'rgl' },
            // In fact, we can use template string for keep regularjs template.
            { test: /\.js$/, loader: 'babel?cacheDirectory'}
        ]

    }
};
```

__使用__

```js


import tpl from './login.html';
import Regular from 'regularjs';

const LoginBabel = Regular.extend({

  name: 'login-babel',

  template: tpl
})

export { LoginBabel }

```

上述代码列举了两种方式

#### [raw-loader](https://github.com/webpack/raw-loader) 加载纯文本模板


> __小贴士__: 事实上如果你使用了[babel-loader](https://github.com/babel/babel-loader) 就可以直接使用多行字符串来管理你的模板， 无需配置raw-loader



#### [rgl-loader](https://github.com/regularjs/rgl-loader) 加载并与解析模板





<a name="browserify"></a>
### browserify


browserify在前些年几乎是唯一的『bundle-all-in-one』同步模块打包方案(即使这种方案算是不温不火), 它依托了NPM以及Commonjs(你仍然可以通过书写transform来支持其他模块标准)来构建自己的生态圈.

同样的，你可以通过两种transform来实现对Regular模板的加载.


var html2string = require('browserify-html2string');

#### [browserify-html2string]()

__配置__

```js
var browserify = require('browserify');
var html2string = require('browserify-html2string');

browserify(['./src/index.js'], {})
  .transform(html2string) // 使用html2string transform
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('public/js'))

```

__模块写法__

```js
var tpl = require("foo.html");

var Component = Regular.extend({
  template: tpl
})
```


#### [regularify](https://github.com/regularjs/regularify)

Regular提供一个browserify的transform:regularify, 它可以用来处理两种格式`rglc`和`rgl`(后缀都是可配置的).


__配置__

```js
browserify(['./src/index.js'], {})
  .transform(html2string) // you can have multiply transform in one building
  .transform(regularify({ END: '}', BEGIN: '{' }))
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('public/js'))
```

__模块写法__


```html
var tpl = require("foo.rgl");

var Component = Regular.extend({
  template: tpl,
  // ....
})

```

点击[regularify主页](https://github.com/regularjs/regularify)了解更多



<a name="nej"></a>
### NEJ

对于网易的同事(特别是杭研)，由于是近水楼台的原因，regularjs已__直接集成进了NEJ框架及其配套打包工具之中__. 与上述任意工具一样， 你可以通过两种方式

#### `text!`：纯文本加载


```js
define(['text!path/to/foo.html', 'path/to/regularjs'], function(tpl, _p){

    var Foo = Regular.extend({
      name: 'foo',
      template: tpl
    })

    return Foo;

});
```

#### `regular!` 预解析


```js
define(['regular!path/to/foo.html', 'path/to/regularjs'], function(tpl, _p){

    var Foo = Regular.extend({
      name: 'foo',
      template: tpl
    })

    return Foo;

});
```

<b>&#x26A0;</b>__注意__由于Regular本身打包的是UMD格式，对于非Commonjs和AMD格式的统一是以全局变量的方式，所以`Regular`无法在模块系统中完成注入，直接从全局获得即可(这里的`_p`属于占位符)


_网易的同事在使用中有疑问可以私泡我(杭州研究院|前端技术部|郑海波)_




<a name="requirejs"></a>
### Requirejs

AMD(requirejs)作为一个有着多年积累的模块标准，在新工具层出不穷的当今(2015年), 我仍认为它是一种较为稳妥的解决方案，并不会立刻被淘汰.

基于requirejs来管理模板，开发者可以有两种选择.

#### [`requirejs-text`](https://github.com/requirejs/text)直接加载模板字符串

__安装__: 

```
bower install requirejs-text
```

__配置__

```js

require.config({
  paths : {
      "text": '../bower_components/requirejs-regular/rgl',
      "regularjs": '../bower_components/regularjs/dist/regular',
      "restate": '../restate',
      "stateman": '../bower_components/stateman/stateman'
  }
});

```

__使用__

```js

require(['text!foo.html', 'regularjs'], function(tpl, Regular){

    var Foo = Regular.extend({
      name: 'foo',
      template: tpl
    })

    return Foo;

});

```





#### [`requirejs-regular`](https://github.com/regularjs/requirejs-regular)加载和预处理模板

与`requirejs-text`插件的`text!`不同， 这个插件配置的前缀是`rgl!`.

__配置__

```js
require.config({
   ...
    paths : {
        "rgl": 'path/to/requirejs-regular/rgl',
        //...
    }
    ...
});

```

__使用__

```js

require(['rgl!foo.html', 'regularjs'], function( tpl, Regular){

    var Foo = Regular.extend({
      name: 'foo',
      template: tpl
    })

    return Foo;

});
```



点[https://github.com/regularjs/requirejs-regular](https://github.com/regularjs/requirejs-regular) 查看详细说明


## 你不用上述模块方案？

如果以上几种模块体系都是不是你的选择，也许你需要自己实现一个处理插件了， regularjs本身以打包了umd模块，可以同时在node和browser环境被使用,
使用 [Regular.parse]({{api}}#parse)来处理你的模板字符串吧， 

```html
var Regular = require("regularjs");

var AST = Regular.parse("{title}", {
  BEGIN: '{',
  END: '}'
})

```

具体可以参考基于webpack的[rgl-loader]()的实现方案, 寥寥几行代码.

> 当然如果你不需要预解析，直接传入字符串给Regular即可.


## 总结

上面的解决方案真是让人眼花缭乱, 但共性也很明显: 

- 所有可以加载纯文本的方式都可以用来加载Regular的模板. 比如`requirejs-text`等插件, 而加载文本几乎是模块化工具的标配了
- 如果你需要预先解析，可以使用`Regular.parse`封装出对应的工具. 已经预先提供了`requirejs`, `webpack`, `browserify` 和 `NEJ`的相关工具. 工具量也就是几行代码的关系, 你完全可以直接在你的构建脚本里手动书写.

