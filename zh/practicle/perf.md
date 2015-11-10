
# 性能优化指引

Regular使用了被诟病无数次的[`脏检查机制`](advanced/dirty.md)，但是它提供了非常多的方案来帮助我们解决性能问题，这个章节将会不断更新。

### 请尽量使用一次绑定

```js

<nest-component r-model={} > </nest-component>

```


### 使用list的`track by`功能


### 使用`isolate`


### 使用`if else`代替  `display:none`


### 使用`throttle`或`until`(tid = setTimeout)的方式来避免频繁更新

