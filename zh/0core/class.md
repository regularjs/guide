#类式继承与组件定义

regularjs的类式继承简化自著名的[|ded/klass|](https://github.com/ded/klass), klass的类式继承的一个特点是，在实例函数中可以通过`this.supr()`来调用父类的同名函数，避免了记忆负担。Regular只保留了其中两个接口:

> ####tips:
>使用exend、implement之外的方式扩展的原型方法无法使用`this.supr()`


<a name="extend"></a>
### 1. `Component.extend(Object specification)`

extend用以派生一个可重用组件，specification中的内容会添加到扩展类的原型中。




__sepecification中的关键参数__

1. __[AST|String] template__ : 模板，参数可以是: 
  * 节点的选择器(字符参数都会先作为选择器匹配，对于如要适配不支持querySelector的浏览器，只能传入id选择器)
  * 模板字符串
  * 预解析的AST(via `Regular.parse()`)

2. __[Function]   init()__: 
  
  初始化函数，这个在组件$compile之后调用(此时已经生成了dom结构)

3. [Function]   config(data): 

  数据预处理函数，这个在组件compile之前调用

4. [Function]   destroy: 

  销毁函数 , __注意__ 如果要自定义回收函数，务必调用父类destroy(`this.supr`)来销毁掉一些通用部分(如事件监听，数据监听)

5. [String]     name: 

  组件名，使得此组件可以以这个节点名内嵌到其它组件内如 `<pager current={current}/>`, pager就是定义的name, __注意__ 如果template是传入的script节点，会获取节点的name属性作为组件名
  
  传入这个属性相当于，Regular.component(name, Component)，即将这个组件注册到全局Regular中，使得所有组件都可以内联使用它。



由于extend同时又是组件定义的接口，所以在extend时，regularjs同时会做一些预处理操作:


1. 解析传入的template参数。
2. 从父类通过原型继承events, directive, filter, component等定义，使得可以访问到父类的定义，而新定义的指令，事件又不会影响到父类，这种封闭性对于[regular的模块策略](../core/use.md)非常重要。
3. 如果有name的定义，则为此组件注册组件名，使得可以以[内嵌组件](../advanced/component.md)的形式使用此组件


[DEMO: modal弹窗组件](http://fiddle.jshell.net/leeluolee/Xvp9S/)

<a name="implement"></a>
### 2. `Component.implement(Object specification)`

扩展组件的原型对象，sepecification与extend一致，扩展的方法同样可以使用`this.supr`

__Example__

```javascript
var Component = Regular.extend();


var component = new Component();

// add hello to prototype
Component.implement({
  hello: function(){}
})

component.hello();

```


<a name="instance"></a>

### 3.`new Component(Object specification)`

实例化组件

sepecification 与 `Component.extend`的specification结构一致，区别是这里传入的是添加为实例属性而不是在prototype上(即可以覆盖extend的声明)

例如，初始化上例中的Modal组件

```javascript
var modal = new Modal({
  data: {title: '提示', content: '请确认提示'} 
})
modal.$on('confirm', function(){
  console.log('haha')
});
```

__实例化时传入的函数无法调用`this.supr()`__



---------------

