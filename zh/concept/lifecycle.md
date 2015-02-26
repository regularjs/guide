
# 组件生命周期

这一章节， 我们来看下在组件的生命周期来帮助我们理解， regularjs内部的运行机制.

## 当 `new Component(options)`

当你实例化组件时，将会发生以下剧情

> 对应的源码来源于[Regularjs.js](https://github.com/regularjs/regular/blob/master/src/Regular.jsL31)

#### 1 options将合并原型中的 [events](events), data

```js
options = options || {};
options.data = options.data || {};
options.events = options.events || {};
if(this.data) _.extend(options.data, this.data);
if(this.events) _.extend(options.events, this.events);

```

#### 2 将options合并到this中

由于传入了参数true, 实例化中传入的属性会覆盖原型属性.

```js
_.extend(this, options, true);
```


#### 3  解析模板

模板本身已经被解析过了(AST)，这步跳过.

```js
if(typeof template === 'string') this.template = new Parser(template).parse();
```

#### 4. 根据传入的options.events 注册事件

注册事件，可以让我们无需去实现那生命的方法(init, destory等)

```js
if(this.events){
  this.$on(this.events);
}
```

#### 5* 调用config函数.

 一般此函数我们会在config中预处理我们传入的数据

```js
this.config && this.config(this.data);
```

#### 6* __编译模板__, 触发一次组件脏检查

这里的脏检查是为了确保组件视图正确,　__到这里我们已经拥有初始化的dom元素__, 你可以通过$refs来获取你标记的.

```js

if(template){
  this.group = this.$compile(this.template, {namespace: options.namespace});
}

```

#### 7* __触发`$init`事件，　并调用this.init方法. ____

调用init之后我们不会进行自动的脏检查.

```js
this.$emit("$init");
if( this.init ) this.init(this.data);
```




## 当 `component.destory()`

当销毁组件时，剧情就要简单的多了.

1. 触发`$destroy`事件

2. 销毁所有模板的dom节点,并且解除所有数据绑定、指令等

需要注意的是，是Regular.prototype.destory完成了这些处理,　所以永远记得在你定义的destory函数中使用`this.supr()`. 一个更稳妥的方案是: 永远不重写destroy, 而是注册`$destory`事件来完成你的回收工作.



