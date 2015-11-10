# 与NEJ Module结合

网易内部有大量的用户，使用的单页方案都是『NEJ的umi调度系统』，由于单页系统中单个模块逻辑较小，很多时候只需要一个Regular组件即可，所以很多同学会写出这样重复的代码


```js

_pro.__onShow = function(){
  this.component = new SomeRegularComponent().$inject('xxx');
}

_pro.__onHide = function(){
  this.component.destroy();
  this.component = null;
}

```


对此，@赵雨森同学 封装了一个从Regular组件到NEJ模块的map. 