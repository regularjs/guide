<a href="#" id="composite"></a>

##内嵌组件的初始化过程.



在编译阶段(AST -> DOM)，每当regularjs碰到一个节点标签例如
(其中，我们假定__`custom-pager`__是一个已注册的组件)


- `<custom-pager attr1={user} attr2=user on-nav={this.nav()}></custom-pager>` 
- `<div class="text" r-hide={!text}></div>`



将会发生以下过程

- 查找当前命名空间下是否可以找到注册为对应名字的组件
- 如果找到,　则视其为内嵌组件(如`custom-pager`),　会执行流程1
  1. 创建一个空对象`data`.
  2. 如果有子元素, 子内容(AST)会作为实例的[`$body`属性](#transclude), 你可以配合 `<r-content>` 来使用它, 也可以将其结合include使用(注意，两种方式的作用域指向是不同的)
  3. 遍历每个属性，
    - 如果不是事件则作为`data`的一个属性值,　如果为插值则建立父组件与子组件的__双向绑定_-
    - 如果是事件名`on-xx`,则注册为Emitter事件,相当于`this.$on(xx, ...)`
  4. 初始化组件, `data`会作为参数传入
  5. 插入到父组件的内容中
- 如果没有找对应组件名 ,则执行流程2
  1. 创建一个节点`document.createElement(tagName)`
  2. 编译它的子元素(如果有的话)，并塞入节点.
  3. 遍历属性值, 根据插值,指令, 事件等分别处理它们
  4. 将节点插入到父组件的内容中

流程1即我们所说的内嵌组件. 注意内嵌组件无法使用指令, 因为它并不是一个真实节点，而是一种抽象.


- __For Example__

  
  __external__组件的模板中声明
  

  ```html
  <pager current={current} total=100 
    on-nav={this.hello()} 
    on-end='end' />
  ```

  
  就相当于是手动调用组件(参数请查看[API:options](?api-zh#options))
  
  

  ```js
  
  var pager = new Pager({
    events: {
      nav : function(){
        extenal.hello();
      },
      end: function(){
        extenal.$emit('end');
      }
    },
    data:{
      total: "100"
    }
  })
  pager.$bind(extenal, 'current');
  ```

  
  其中extenal代表嵌入它的外层组件. 其中事件的处理与dom事件几乎完全一致，区别就是$event参数变成了你`$emit`的事件参数.
  



[【DEMO】](http://jsfiddle.net/leeluolee/DCFXn/)


where
  
  - template in `#external`
    
    ```html
    {list.length}:{current}
     <pager total={Math.floor(list.length/20)} 
            current={current} 
            on-nav={this.changePage($event)}/>

     <pager total={Math.floor(list.length/20)} 
            current={current} 
            on-nav='nav' />
    ```