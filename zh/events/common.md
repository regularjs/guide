
# regularjs中事件的共性

无论是组件事件还是DOM事件， 它们都具有一些共性

## 回调方式取决于你传入的属性值

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

## 当然它们也有所不同


1. 组件事件是由`$emit`方法抛出, 而DOM由用户触发， 由浏览器抛出(除了自定义事件)
2. dom事件由于DOM本身的特点是可以冒泡的， 但是组件事件没有冒泡这一机制。
