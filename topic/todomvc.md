
## 前言

现在市面上充斥了越来越多的javascript框架，给开发者的技术选型带来极大的选择成本，[todomvc](http://todomvc.com/)在这个环境下应运而生。

由于todomvc有一个完整的实现定义，它复杂度适中，大概就是平时开发的一个组件的功能复杂度，开发者可以轻松对各个框架的代码做对比，同时由于功能一致，也可以进行各框架之间的[性能对比(当然这个测试案例其实并没有很大的实际意义)](http://regularjs.github.io/perf/todomvc-benchmark/index.html)。


![todomvc](http://todomvc.com/site-assets/screenshot.png)


<!-- more-->

接下来这篇指南会一步步的带大家使用[Regularjs](http://regularjs.github.io/)按照规范实现一个完整的todomvc的app。


## 第一步: 静态页面

第一步，我们需要一个完整的静态页面作为后续逻辑的基础，这里我们不再详细介绍如何实现这个页面，直接从todomvc的官网copy一份静态页面下来。

```html
<!--引入todomvc.css-->
 <link rel="stylesheet" href="https://rawgit.com/tastejs/todomvc-app-css/master/index.css">

<div id="todoapp">
  <div>
    <h1>TODOMVC</h1>
    <input id="new-todo" placeholder="What needs to be done?">
  </div>
  <section id="main">
    <input id="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    <ul id="todo-list">
      <li class="completed">
        <div class="view">
          <input class="toggle" type="checkbox" checked>
          <label>sleep</label>
          <button class="destroy"></button>
        </div>
        <input id="edit" class="edit">
      </li>
      <li class="">
        <div class="view">
          <input class="toggle" type="checkbox">
          <label>work</label>
          <button class="destroy"></button>
        </div>
        <input id="edit" class="edit"></li>
    </ul>
  </section>
  <footer id="footer">
    <span id="todo-count"> <strong>1</strong>
      item left
    </span>
    <ul id="filters">
      <li> <a class="selected">All</a> </li>
      <li> <a class="">Active</a> </li>
      <li> <a class="">Completed</a> </li>
    </ul>
    <button id="clear-completed">Clear completed (1)</button>
  </footer>
</div>
<footer id="info">
  <p>Double-click to edit a todo</p>
  <p>Created by @leeluolee</p>
  <p>
    Part of
    <a href="http://todomvc.com">TodoMVC</a>
  </p>
</footer>
<!-- 引入regularjs -->
<script src="https://rawgit.com/regularjs/regular/master/dist/regular.js"></script>
```

你可以直接保存成index.html来查看效果，也直接在[codepen中查看](http://codepen.io/leeluolee/pen/EuHcd)



##第二步: 视图(模板)与数据model分离

按以往的经验，我们应该使用jQuery等框架来一个个绑定节点处理业务逻辑了。这样会带来很多的问题，一旦你去绑定了大量的dom事件和进行了过多的dom操作，往往会带你进入难以维护的深渊，我们可以使用模板来强制将model(模型)与视图(view)分开。

所以这一步，我们什么都不做，仅仅只是将上面的静态页面转由regularjs模板生成。

```html
<div id="todoapp"></div>
<script type='template/regular' id='todomvc'>
  <div>
    <h1>TODOMVC</h1>
    <input id="new-todo" placeholder="What needs to be done?">
  </div>
  <section id="main">
    <input id="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    <ul id="todo-list">
      <li class="completed">
        <div class="view">
          <input class="toggle" type="checkbox" checked>
          <label>sleep</label>
          <button class="destroy"></button>
        </div>
        <input id="edit" class="edit">
      </li>
      <li class="">
        <div class="view">
          <input class="toggle" type="checkbox">
          <label>work</label>
          <button class="destroy"></button>
        </div>
        <input id="edit" class="edit"></li>
    </ul>
  </section>
  <footer id="footer">
    <span id="todo-count"> <strong>1</strong>
      item left
    </span>
    <ul id="filters">
      <li> <a class="selected">All</a> </li>
      <li> <a class="">Active</a> </li>
      <li> <a class="">Completed</a> </li>
    </ul>
    <button id="clear-completed">Clear completed (1)</button>
  </footer>

</script>

```

然后我们利用regularjs来compile这个模板

```js
var TodoMVC = Regular.extend({
    template: "#todomvc"
})
var app = new TodoMVC({
  data: {}
}).$inject('#todoapp');
```

在codepen中查看结果

其中`Regular.extend`用于定义一个组件，最基本的情况就是指定一个模板（template字段），而`new TodoMVC`相当于是compile这个组件，一般我们会在这里传入`data`模型，我们同时将compile后的组件插入到节点`#todoapp`中。

事实上大家都发现了，这里我们完全没有做额外的逻辑，但是这是将view与model分开的关键一步。

[DEMO2](http://codepen.io/leeluolee/pen/xvCjm)

## 第三步: 使用#list指令来处理列表

我们发现，很明显的model可以抽象成一份todos的数组，所以我们的第一步是使用list来处理列表逻辑（这里我们省略了其余部分的模板，只列出了li部分的逻辑）

```html
....
{#list todos as todo}
<li  r-class={ {'completed': todo.completed, 'editing': todo.editing} }>
    <div class="view">
      <input class="toggle" type="checkbox" r-model={ todo.completed }>
        <label on-dblclick={todo.editing = true}>{ todo.description }</label>
        <button on-click={ todos.splice(todo_index,1) } class="destroy"></button>
        </div>
      <input id="edit" class="edit" on-enter={ todo.editing = false } r-model={todo.description} autofocus>
  </li>
{/list}

.....

```
list规则用于处理循环逻辑，完整描述可以查看[Regularjs指南的list部分](http://regularjs.github.io/guide/zh/syntax/list.html)。这里我们也应用到了最基础的[插值](http://regularjs.github.io/guide/zh/syntax/inteplation.html)(`{}`)

我们传入一个todos的假数据
```javascript
var todos = [
    {completed: true, description: "sleep" },
    {completed: false, description: "work" }
]
var app = new TodoMVC({
    data: {todos: todos}
}).$inject("#todoapp")
```

[DEMO3](http://codepen.io/leeluolee/pen/krzjc)

可以看到我们同时利用directive处理了一些业务逻辑

1. `r-class`： 属于对象表达式，每当值为真，添加对应的键作为class
2. `r-model`: 使表单项与某字段形成双向绑定
3. `on-xx`: 绑定事件

regularjs的parse是基于字符串的，它输出包含完整信息的ast给基于dom的compiler使用，这样其实输出的内容是不会包含一些常规dom-based模板的placeholder信息的（比如angular的`ng-xx`）。


到这一步，其实可以发现，我们可以处理一部分业务逻辑了，比如

1. 双击编辑
2. 回车完成编辑
3. 标记完成
4. 删除指定的todo项(利用todo_index下标，它的命名取决于你定义的列表项的名称加`_index`)

regularjs的数据驱动是基于代码脏检查的（与angular一致），所以你可以直接操作裸数据来完成状态变更。



## 第四步： 完善我们的组件业务逻辑

目前，除了中间列表部分的view，其它部分的数据都没有完成数据联动。我们遗留的业务逻辑有:

1. 点击下方的`All Active Completed`面板要完成todos面板的切换来分别显示所有、未完成、完成的todo列表
2. 上面的input可以进行新建todo
3. 切换左上角的checkbox可以进行标记全部和取消编辑全部的操作
4. 点击右下角的clearComplete 应该可以删除所有完成的列表项

一个组件的业务逻辑（对于一个mvvm模式的组件来讲，业务逻辑应该是纯数据操作）应该是在定义时就进行确定。我们在extend时定义这些业务。

```javascript

var TodoMVC = Regular.extend({
    template: '#todomvc',
    // get the list;
    getList: function(filter){
      if(!filter || filter === 'all') return this.data.todos;
      else return this.data.todos.filter(function(item){
        return filter === 'completed'? item.completed : !item.completed;
      });
    },
    // toggle all todo's completed state
    toggleAll: function(sign){
      this.data.todos.forEach(function(item){
        return item.completed = !sign;
      });
    },
    // clear all compleled
    clearCompleted: function(){
      this.data.todos = this.data.todos.filter(function(item){
        return !item.completed
      });
    },
    // create a new todo
    newTodo: function(editTodo){
      var data = this.data;
      data.todos.unshift({description: editTodo});
      data.editTodo = "";
    }
})


```

至此，TodoMVC实现了以下4个对应逻辑

1. getList(sign): 用于获得不同的列表
2. newTodo(editTodo): 用于创建新的todo
3. toggleAll(sign): 用于全部标注完成，和全部取消
4. clearCompleted(): 用于删除所有完成的todo

大家可以发现，所有的操作都是基于裸数据的业务逻辑，没有添加任何dom操作。

但是如何使用这些函数定义呢？

很简单，首先extend的函数是定义在组件原型上的，其次模板中的this是指向组件实例，即：

我们可以通过this.xx()等方式在模板中调用这些逻辑定义。完整模板我们修改为

```html
<div>
  <h1>regular-todo</h1>
  <input id="new-todo" 
    on-enter={ this.newTodo(editTodo) } 
    placeholder="What needs to be done?" 
    r-model={ editTodo }>
</div>
<section id="main">

  <input id="toggle-all" type="checkbox" 
    on-change={this.toggleAll(items.length === this.getList('completed').length)} 
    checked={items.length === this.getList('completed').length }>
  
  <label for="toggle-all">Mark all as complete</label>
  <ul id="todo-list">
    {#list this.getList(filter) as todo}
    <li  r-class={ {'completed': todo.completed, 'editing': todo.editing} }>
      <div class="view">
        <input class="toggle" type="checkbox" r-model={ todo.completed }>
        <label on-dblclick={todo.editing = true}>
            { todo.description }
        </label>
        <button 
            on-click={ todos.splice(todo_index,1) } class="destroy"></button>
      </div>
      <input id="edit" class="edit" 
        on-enter={ todo.editing = false } 
        r-model={todo.description} autofocus>
    </li>
    {/list}
  </ul>
</section>
<footer id="footer">
  <span id="todo-count"> <strong>{ this.getList('active').length }</strong>
    { this.getList('active').length === 1 ? 'item' : 'items' } left
  </span>
  <ul id="filters">
    <li>
      <a class="{ filter === 'all'? 'selected' : '' }"  href="javascript:;" on-click={filter='all'}>All</a>
    </li>
    <li>
      <a class="{ filter === 'active'? 'selected' : '' }" href='javascript:;' on-click={filter = 'active'}>Active</a>
    </li>
    <li>
      <a class="{ filter === 'completed'? 'selected' : '' }" href="javascript:;" on-click={filter = 'completed'}>Completed</a>
    </li>
  </ul>
  <button id="clear-completed" on-click={this.clearCompleted()}>Clear completed ({ this.getList('completed').length })</button>
</footer>
```
[DEMO4](http://codepen.io/leeluolee/pen/mcHxw)


## 第五步： 使用计算属性来简化我们的表达式

这里我们发现，使用了大量的相似的表达式在我们的模板里，比如为了处理全选与反选，我们引入有如此肮脏的模板代码

```html
 <input id="toggle-all" type="checkbox" 
    on-change={this.toggleAll(items.length === this.getList('completed').length)} 
    checked={items.length === this.getList('completed').length }>
```
如果我们引入计算属性（computed-property）就可以简化此表达式

我们可以extend时进行计算属性的定义

```javascript
var TodoMVC = Regular.extend({
    template: "#todomvc",
    computed: {
      completedLength: "this.getList('completed').length",
      activeLength: "this.getList('active').length",
      allCompleted: {
        get: function(data){
          return data.todos.length === this.getList('completed').length
        },
        set: function(sign,data){
          data.todos.forEach(function(item){
            item.completed = sign;
          })
        }
      }
    }
    //....other methods...
})
```

在这里我们定义三个计算属性

1. completedLength: 代表完成的todo的length
2. activeLength： 代表未完成的Length，这里可以看到1和2属性，我们都直接传入了一个字符串表达式，因为这里只需要处理读操作，即只是表达式的一种简写替代
3. allCompleted: 标记是否全部完成，为真则将左上的checkbox打钩。需要注意的是这里还设置了setter函数，用于处理allCompelted的写操作，这里我们做的是，将所有todo标记完成或未完成

修改后的模板如下


```html
<div>
  <h1>regular-todo</h1>
  <input id="new-todo" on-enter={ this.newTodo(editTodo) } placeholder="What needs to be done?" r-model={ editTodo }>
</div>
<section id="main">

  <input id="toggle-all" type="checkbox" name='toggle' r-model='allCompleted'>
  <label for="toggle-all">Mark all as complete</label>
  <ul id="todo-list">
    {#list this.getList(filter) as todo}
    <li  r-class={ {'completed': todo.completed, 'editing': todo.editing} }>
      <div class="view">
        <input class="toggle" type="checkbox" r-model={ todo.completed }>
        <label on-dblclick={todo.editing = true}>{ todo.description }</label>
        <button on-click={ todos.splice(todo_index,1) } class="destroy"></button>
      </div>
      <input id="edit" class="edit"on-enter={ todo.editing = false } r-model={todo.description} autofocus></li>
    {/list}
  </ul>
</section>
<footer id="footer">
  <span id="todo-count"> <strong>{ activeLength }</strong>
    { activeLength === 1 ? 'item' : 'items' } left
  </span>
  <ul id="filters">
    <li>
      <a class="{ filter === 'all'? 'selected' : '' }"  href="javascript:;" on-click={filter='all'}>All</a>
    </li>
    <li>
      <a class="{ filter === 'active'? 'selected' : '' }" href='javascript:;' on-click={filter = 'active'}>Active</a>
    </li>
    <li>
      <a class="{ filter === 'completed'? 'selected' : '' }" href="javascript:;" on-click={filter = 'completed'}>Completed</a>
    </li>
  </ul>
  <button id="clear-completed" on-click={this.clearCompleted()} >Clear completed ({ completedLength })</button>

</footer>
```


至此，我们利用大约40行模板+50行代码实现了todomv。并且完全没有掺入dom操作，完全是按照以前使用模板的思维。

## 第六步: 使用if/else来控制区域的创建与回收

按照todomvc的规范定义，我们遗漏了以下两个逻辑

1. 需要在没有todos的情况隐藏显示部分，
2. 并且在没有可清楚todo的情况下，隐藏

我们可以利用两种方式来实现

1. [{#if}](http://regularjs.github.io/guide/zh/syntax/if.html): 这种情况会将区域完全回收，并移除所有绑定，这是一种语法元素。
2. [r-hide](http://regularjs.github.io/guide/zh/core/directive.html#4-r-hide-): 你也可以使用指令来切换节点的可见性，这只是一种指令增强。

1相较于2，最大的不同是完整回收，并且可以作用于任意的块: 比如多个并列节点。而2只能以节点为单位（即类似与angular的ng-show）

这里我们采用if来完成我们的需求。修改后的模板如下

```html

{#if !!todos.length}
<section id="main">
...ignored for short...
</section>
<footer id="footer">
  ...ignored for short...
  {#if completedLength}
  <button id="clear-completed" on-click={this.clearCompleted()} >Clear completed ({ completedLength })</button>
  {/if}
</footer>
{/if}

```

[DEMO5](http://codepen.io/leeluolee/pen/mcHxw)


##第七步: 抽离子组件

到目前为止，除了路由部分，我们已经完整实现了整个组件（由于regularjs定义为一个类库，所以不提供框架级的路由服务，大家可以通过类似[stateman](http://github.com/leeluolee/stateman)等第三方库来实现路由）。

但是所有的view都写在了一个模板中，这个不利用后续的重构。我们可以通过子组件来提取一些独立的逻辑，在这个例子里，一个todo项目显然可以独立出来成为一个组件

```html
<li  r-class={ {'completed': todo.completed, 'editing': todo.editing}}>
  <div class="view">
    <input class="toggle" type="checkbox" r-model={ todo.completed }>  
    <label on-dblclick={todo.editing = true}>{ todo.description }</label>
    <button on-click="remove" class="destroy"></button>
  </div>
  <input id="edit" class="edit"on-enter={ todo.editing = false } r-model={todo.description} autofocus>
</li>
```

注意这里的`on-click='remove'` 代表点击后抛出自定义事件`remove`，你可以捕获这个事件来处理删除操作（因为我们无法获得todos数据了）

对应的组件定义

```javascript
var Todo = Regular.extend({
  data: {todo: {}},
  name: "todo",
  template: "#todo"
});

```


注意`name`参数代表，这个组件可以通过`<todo ></todo>`的方式插入其它模板中。

重构之前的list部分


```html
{#list this.getList(filter) as todo}
    <todo todo={todo} on-remove={todos.splice(todo_index,1)} ></todo>
{/list}
```

这里我们直接通过on-remove来捕获子组件抛出的`remove`事件。

很明显的看到，利用子组件和持续重构可以帮助我们维护越来越复杂的组件关系。

[DEMO6](http://codepen.io/leeluolee/pen/dGxCb)



## 结尾

至此，我们在仅40行模板+50行js代码(纯数据的业务操作)实现了一个功能基本完整的组件，并且没有引入任何dom操作。


