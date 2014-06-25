#regularjs中的类式继承

regularjs的类式继承是简化自著名的[|ded/klass|](https://github.com/ded/klass), klass的类式继承的一个特点是，在实例函数中可以通过`this.supr()`来调用父类的同名函数，避免了记忆负担. Regular只保留了其中两个接口:

### 1. `extend`

派生一个新组件类,传入的定义会添加到新组件的原型上

__Example__

同时extend又是组件定义的接口，所以在extend时，regularjs同时会做一些预处理操作:

1. 解析传入的template参数.
2. 从父类通过原型继承events, directive, filter, component等定义，使得可以访问到父类的定义，而新定义的指令,事件又不会影响到父类, 这种封闭性对于[regular的模块策略](../core/use.md)非常重要.
3. 如果有name的定义, 则为此组件注册组件名，使得可以以[内嵌组件](../advanced/component.md)的形式使用此组件


### 2. `implement`

扩展本组件的原型方法和属性，与extend一样，扩展的方法同样可以使用`this.supr`

__Example__





