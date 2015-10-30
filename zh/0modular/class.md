

# 基于类的组件体系

regularjs的类式继承简化自著名的[&#x261E;ded/klass](https://github.com/ded/klass)

Regular只保留了其中两个接口(细节请看API):


- [extend]({{ref}}?api-zh#extend):  从父组件派生一个可重用组件
- [implement]({{ref}}?api-zh#implement):  扩展当前组件的原型对象


## regularjs中的'类'沿承自klass的特点

`Component.extend`返回的就是一个普通的构造函数， 不过与原始[ded/klass]一样, 此构造函数拥有以下特点

- 子类构造函数同时也拥有`extend`, `implement`方法.

```javascript
var Component = Regular.extend({
    say: function(){},
    run: function(){}
});
var SubComponent = Component.extend();

SubComponent.implement({
    run: function(){ }
})
```

- 在方法中可以通过`this.supr()`来调用父类的同名函数，避免了使用负担.继续上例.

```js

var ChildComponent = Component.extend({
    say: function(){
        this.supr() // call Component.prototype.say.
        console.log("sub say");  // other logic
    }
})

ChildComponent.implement({
    run: function(){
        this.supr() // call Component.prototype.say
    }
})

var component = new ChildComponent();
component.run（);

```


>  __Tips __:使用exend、implement之外的方式扩展的原型方法无法使用`this.supr()`





## 不同点

由于extend同时又是组件定义的接口，所以在extend时，regularjs同时会做一些预处理操作:


- 预解析传入的template参数. 保证由这个类的模板只会被解析一次.

- 子类同时拥有component, directive, filter, event函数， 用来[扩展组件功能](./extension.md)

- 如果定义时传入了name, 则为此组件注册组件名，使得可以以[内嵌组件](../component/README.md)的形式使用此组件

```js
var Modal = Regular.extend({
    name: 'modal'
})

```




-----

下一个小节， 我们来看看我们如何来扩展组件的能力: 

- 指令directive
- 过滤器filter
- 自定义dom事件
- 注册内嵌组件

