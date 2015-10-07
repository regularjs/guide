
#安装


## 下载

__直接下载__


1. [regular.js(83kb)](https://rawgit.com/regularjs/regular/master/dist/regular.js)
2. [regular.min.js(39kb)](https://rawgit.com/regularjs/regular/master/dist/regular.min.js)


__使用bower下载__

* `bower install regularjs`
* find script in `bower_components/regularjs/dist/regular.js`

__使用component__

* `component install regularjs/regular`
* `var Regular = require('regularjs')`




##使用

__直接插入script__

```html
<script src="path/to/regular.js"></script>
```

直接使用注册在全局的__Regular__命名空间

__使用amd加载器(例:requirejs)__


```javascript
require(['path/to/regular.js'], function(Regular){
  console.log(Regular) 
})
```






