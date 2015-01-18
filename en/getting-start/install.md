
#Installation


## Download

__directly__

1. [regular.js(83kb)](https://rawgit.com/regularjs/regular/master/dist/regular.js)
2. [regular.min.js(39kb)](https://rawgit.com/regularjs/regular/master/dist/regular.min.js)


__use bower__

* `bower install regularjs`
* find script in `bower_components/regularjs/dist/regular.js`

__use component__

* `component install regularjs/regular`
* `var Regular = require('regularjs')`

## Usage

__directly insert__

```html
<script src="path/to/regular.js"></script>
```

`Regular` object is now accessible in window.

__use AMD loader__

```javascript
require(['path/to/regular.js'], function(Regular){
  console.log(Regular)
})
```





