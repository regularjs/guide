# 组件化



与web component类似， 一个regularjs的组件可以通过两种方式进行初始化. 就如同我们一直提到的pager组件



### 1. 通过js直接初始化

```js
var pager = new Pager({
    data: {
        current: 1
    }
})
```


### 2. 在其它组件的模板中声明初始化

__example__

```html
<pager current=1 ></pager>
```


第二种方式就是常说的__内嵌组件__.


事实上， regularjs组件的领域模型是第一种方式， 第二种方式只是提供了一个在模板中声明来初始化的途径. 而恰恰是这种能力， 带给了regularjs类似custom element的使用体验.
