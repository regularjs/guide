var gulp = require("gulp"),
  deploy = require("gulp-gh-pages");

gulp.task('deploy', function () {
  gulp.src("_book/**/*.*")
    .pipe(deploy({
      remoteUrl: "git@github.com:regularjs/guide"
    }))
    .on("error", function(err){
      console.log(err)
    })
});



<!--引入todomvc.css-->
 <link rel="stylesheet" href="https://rawgit.com/tastejs/todomvc-app-css/master/index.css">

<div id="todoapp"></div>

<footer id="info">
  <p>Double-click to edit a todo</p>
  <p>Created by @leeluolee</p>
  <p>
    Part of
    <a href="http://todomvc.com">TodoMVC</a>
  </p>
</footer>

<script type='template/regular' id='todomvc'>
<div>
  <h1>regular-todo</h1>
  <input id="new-todo" on-enter={ this.newTodo(editTodo) } placeholder="What needs to be done?" r-model={ editTodo }>
</div>
  
{#if !!todos.length}
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
  {#if completedLength}
  <button id="clear-completed" on-click={this.clearCompleted()} >Clear completed ({ completedLength })</button>
  {/if}
</footer>
{/if}
</script>
<!-- 引入regularjs -->
<script src="https://rawgit.com/regularjs/regular/master/dist/regular.js"></script>
