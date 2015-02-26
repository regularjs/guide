# 组件事件

Regularjs集成了一个轻量级的Emitter, 使得所有组件都可以使用以下接口来实现事件驱动的开发

- [component.$on]({{ref}}?api-zh#on): 用于添加事件监听器
- [component.$off]({{ref}}?api-zh#off): 用于解绑事件监听器
- [component.$emit]({{ref}}?api-zh#emit): 用于触发某个事件




## 模板里声明组件事件绑定

当组件以内嵌组件的方式初始化时， 它的事件的绑定方式与DOM事件非常类似, 即

__所有__组件上__的`on-`开头的属性都会被作为组件事件绑定处理__(其它属性会作为data的属性传入)

假设已经注册了一个名为`pager`的翻页器组件

```html
<div>
    <pager on-nav={ this.refresh() }></pager>
</div>
```

这个例子的意思是， 每当作为内嵌组件的modal抛出`confirm`事件(通过[$emit('confirm')]({{ref}}?api-zh#emit)), 外层组件会运行refresh方法. 

既然我们已经学习了[Dom 事件](./dom.md) , 相信对这种处理方式无需赘言. 

[__&#x261E; DEMO__](http://jsfiddle.net/leeluolee/y8PHE/3/)

你可能需要了解[内嵌组件](component/README.md)的相关概念.

## 内建生命周期内的组件事件

regularjs会在初始化时的关键阶段抛出事件

1. $config: 会在compile之前触发， 你可以在此时预处理组件数据
2. $init : 会在compile之后触发， 此时， dom结构已经生成， 你可以通过ref来获取了
3. $destroy: 会在组件被destroy时， 触发
4. $update: 在一次digest阶段， 如果数据有更新(无论是什么数据), 会触发一次`$update`事件

`$`前缀是为了区分这个是个内建的事件. 

下一节，我们会学习下DOM事件与组件事件的相同点与不同点.



## 与dom事件的异同

### 相同点

取决于你传入的值是表达式插值还是普通属性，regularjs会做不同的响应处理，例如

- 表达式(e.g. `on-click={this.remove()}`)
  
  如果传入的是表达式，与angular类似，一旦事件触发，此表达式会被运行一次。
  
  __Example__
  ```html
    <div on-click={this.remove(index)}>Delte</div>
  ```

   在你的组件中定义remove逻辑

  ```javascript
  var Component = Regular.extend({
    template:'example',
    remove: function(index){
      this.data.list.splice(index ,1);
      // other logic
    }
  })

  ```

  
  一般来讲推荐这种方式来处理事件. 
  
  


-  非表达式(e.g. `on-click="remove"`)

  当传入的不是表达式，事件会被代理到组件的事件系统中，你可以使用`$on`去处理此事件
  
  __Example__

  ```html
    <div on-click="remove">Delte</div>
  ```

   然后利用`$on`方法来处理事件

  ```javascript
  var Component = Regular.extend({
    template:'example',
    init: function(){
      this.$on("remove", function($event){
          // your logic here
      })
    }
  })

  ```

### 当然它们也有所不同


1. 组件事件是由`$emit`方法抛出, 而DOM由用户触发， 由浏览器抛出(除了自定义事件)
2. dom事件由于DOM本身的特点是可以冒泡的， 但是组件事件没有冒泡这一机制。


