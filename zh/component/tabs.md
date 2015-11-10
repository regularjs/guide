
# 使用regularjs实现Tabs组件

Tabs是最常见的一种组件，虽然它比todomvc更加简单，但是却 非常适合用来说明内嵌组件。

经过这个例子，你将会对regularjs中的组件化印象深刻。目的不是为了去实现Tabs，而是以开发者的角度去思考如何有效的利用regularjs的特性结合一步步的重构 得到最终我们需要的结果

1. regularjs中的"transcluded content"(内嵌内容)，并且结合占位`<r-content>`引入这段内容。
2. regularjs组件之间的自由组合

本文的例子修改自于一个一位网友的Issue，所以组件的命名会贴近其原始的驼峰方式（有点类似React）。

__DEMO结构__

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />
  </head>
  <body>

    <script src="//rawgit.com/sindresorhus/multiline/master/browser.js"></script>
    <script src="//rawgit.com/regularjs/regular/master/dist/regular.min.js"></script>
    <script> 
    // our code here 
    </script>

  </body>
</html>

```

这里我们引入了两个额外的库

1. multiline: 帮助我们书写多行字符串
2. bootstrap.css: 基本的样式基础

## Step 1： 快刀斩乱麻

第一个版本，我们会按最原始的方式去实现这个Tabs，然后在后续版本中慢慢修改成满意的版本。

> 永远不要急于优化。

```html
var Tabs = Regular.extend({
  template: multiline(function(){/*
    <ul class="nav nav-pills">
     <li class={active=='home' ? 'active': ''} on-click={active='home'}><a href="#">Home</a></li>
     <li class={active=='profile'?'active': ''} on-click={active='profile'}><a href="#">Profile</a></li>
     <li class={active=='messages'?'active': ''} on-click={active='messages'}><a href="#">Messages</a></li>
    </ul>
    <div class='content'>
      <div class='pane home' r-hide={active!='home'}>Home detai</div>
      <div class='pane profile' r-hide={active!='profile'}>Profile Detail</div>
      <div class='pane messages' r-hide={active!='messages'}>Message Detail</div>
    </div>
  */}),
  config: function( data ){
    if(!data.active) data.active = 'home';
  }
})

```

[【DEMO】]()

我们做的工作可谓非常原生态

事实上，在一个CMS系统中，Tabs会极端的常用，如果每次实现一个tabs我们都需要写上面那段，你是不是会开始抓狂了呢？

## Step 2: 使用list

可能直觉上我们第一个会想到的就是__使用list__，摒除冗余逻辑，tab列表应该在实例化时传入

```js
var Tabs = Regular.extend({
  name: 'Tabs',
  template: multiline(function(){/*
    <button class='btn' on-click={this.addTab()}>Add a tab</button>
    <ul class="nav nav-pills">
      {#list tabs as tab}
        <li class={active==tab ? 'active': ''} on-click={active = tab}><a href="#">{tab.title}</a></li>
      {/list}
    </ul>
    <div class='content'>
      {#include active.content}
    </div>
  */}),
  config: function( data ){
    if(!data.active && data.tabs) data.active = data.tabs[0];
  },
  addTab: function(){
    var tabs = this.data.tabs;
    tabs.push({
      title: 'title ' + tabs.length,
      content: '<p>content ' + tabs.length + '</p>'
    })
  }
})

```

然后我们可以直接初始化 或以内嵌组件调用的方式使用这个Tab组件。

```js
// initialize 
new Tabs({
  data: {
    tabs: [
      {title: 'home', content: '<p>Home Detail</p>'},
      {title: 'profile', content: '<p>Profile Detail</p>'},
      {title: 'messages', content: '<p>Messages Detail</p>'}
    ]
  }
}).$inject(document.body)

// nested way
new Regular({
  template: "<h2>Using in composite way</h2><Tabs tabs={tabs} isolate />",
  data: {
    tabs: [
      {title: 'home', content: '<p>Home Detail</p>'},
      {title: 'profile', content: '<p>Profile Detail</p>'},
      {title: 'messages', content: '<p>Messages Detail</p>'}
    ]
  }
}).$inject(document.body)
```

其中 

- [list语句](http://regularjs.github.io/reference/index.html?syntax-zh#list)帮助我们遍历显示我们的tab名称。
- [include](http://regularjs.github.io/reference/index.html?syntax-zh#include) 用来动态的显示某个片段，这里每当active.content变化，include所在的内容就会进行一次局部渲染。__include与插值完全不同，include接受一个完整的模板片段__
- isolate组件属性: 注意，我们发现在内嵌组件，`tabs={tabs}` 会导致内层数据与外层形成双向绑定，在这个例子里，tabs是仅仅只是需要tabs这个初始值而已，我们不需要数据的同步。

这个版本似乎好了点，tab变得可配置了，我们点击按钮还可以进行tab的动态添加，一切似乎变得可用了。

但是我们想想看还有什么不完美的地方。

1. on-click的绑定
2. 切换按钮的类名插值
3. 面板的显示隐藏


## Step 3: 理想的使用

继续我们步骤1的思考，反过来想想，怎么样的Tabs组件是我们期望的？

```html
<Tabs>
  <TabPane title="Tab 1" >
    wellcome, {user.name}
  </TabPane>
  <TabPane title="Tab 2" >
    Content of Tab2.
  </TabPane>
  <TabPane title="Unread {user.unread_message}" >
    Unread message here..
  </TabPane>
</Tabs>
```

Tabs组件有个特点，就是它的面板和按钮在逻辑上应该是属于一个整体，但是在结构上却分属与两个不同的容器。



## 最终Tabs的使用效果

在开始之前，我们先直接展示我们最终达到的效果。

__简单版__

```html
<Tabs>
  <TabPane title="Tab 1" >
    wellcome, {user.name}
  </TabPane>
  <TabPane title="Tab 2" >
    Content of Tab2.
  </TabPane>
  <TabPane title="Unread {user.unread_message}" >
    Unread message here..
  </TabPane>
</Tabs>
```
http://plnkr.co/edit/1W8y0z27Irw4hyfz5WCT?p=preview

[【DEMO】](http://plnkr.co/edit/1W8y0z27Irw4hyfz5WCT)

跟react, angular之类的版本非常接近。Tabs即我们要创造的切换组件，它的内嵌内容是若干个TabPane组件。


这个例子很简单，但是它有两层的内嵌内容，所以很适合作为例子来帮助我们例子内嵌内容。


不要急着看看代码，让我们先一步步分解需求来实现效果。


## 需求分析

要实现


__App组件的创建时发生的那些事儿__

当我们调用new App()时，期间的各组件生命周期中的关键顺序如下: 

```coffeescript
App config => App compile(which will initialize the Tabs)
    => Tabs config => Tabs  compile (which will intialize the TabPane)
        =>  TabPane1 config => TabPane1 compile => TabPane1 init
        =>  TabPane2 config => TabPane2 compile => TabPane2 init
     => Tabs init
App init;
```

即在TabPane创建时，其实Tabs的应用已经存在了，regularjs中，

__如果组件是其它组件的内嵌内容，那你可以通过`$outer`来获取这个外部引用__

_结合[组件生命周期](../concept/lifecyle.md)来加深理解_

借由这个原理，我们可以在TabPane的config时，通过this.$outer获得它外层的组件（即Tabs）。

```
var TabPane = Regular.extend({
    // ... code
    config: function(){
        if(this.$outer) this.$outer.data.tabs.push(this);
    }
    // ... 
})
```
这样，每个pane组件就作为一份数据放入了外层容器`Tabs`的`data.tabs`数组中了，这样在外层的tabs组件中，我们就可以通过遍历来先输出tabs的title。

```

```





## 为何不使用传参，而使用内嵌内容来实现

其实，我们可以以一种更简单的方式来实现Tabs组件

```html

var Tabs = Regular.extend({
    name: "tabs",
    template: multiline(function(){/*
    <ul class="nav nav-tabs">
        {#list panes as pane}
        <li r-class={{active: pane==seletedTab}} on-click={seletedTab = pane}>
          <a href="#">{#include pane.title}</a>
        </li>
        {/list}
      </ul>
      <div class="content">
          {#include seletedTab.content}
      </div>
    */}),
    config: function(data){
      if (!data.seletedTab) data.seletedTab = data.panes[0]
    }
    
})

```

使用

```js

var app = new Regular({
    template: 
      "<h2>create Tabs without transclusion</h2>\
      <tabs panes={panes}  ref=tab/> ",
    data: {
        panes: [
            {title: "Tab 1" , content: "wellcome, {user.name}" },
            {title: "Tab 1" , content: "Content of Tab2" },
            {title: "Unread {user.unread_message}" , content: "Unread message here" }
        ]
        
    }
}).$inject(document.body)


```

其实作者也经常在实际产品开发阶段使用上面这种直接传参的 快刀斩乱麻的方式。

因为很明显，这种方式的实现更加简单，但是在使用Tabs组件时，内嵌内容的版本显然可以带来带来最佳的可读性。

关于MVVM时代的控件封装的取舍，可以参考下[民工精髓的这篇文章](https://github.com/xufei/ng-control/issues/2)。

还有一个无法取代内嵌内容的原因是，__通过include引入的话，模板的context是指向tabs组件的，但是`<r-content>`的话，内嵌内容的context是指向声明它的组件的，即上例的App__，所以我们发现{user.name}等插值都没有显示，因为在tabs中并没有定义user对象，这又是一个使用性上的天然优势。否则你需要再传入user对象给tab组件。

```
<tabs user={user}></tabs>
```

这显然无形中让这个tabs变得不那么通用了。

## 废物利用下，我们之前写完的TODOMVC组件和HelloRegular组件。..

regularjs的主题是使用动态模板来书写数据驱动的组件，而组件的特点就是可以通过声明来组合使用

还记得大明湖畔的HelloRegular与TodoMVC吗？我们会


```html
<Tabs ref="tabs">
  <TabPane title="Tab {item_index+1} " >
    <HelloRegular username='leeluolee'/>
  </TabPane>
  <TabPane title="Tab {item_index+1} " >
    <TodoApp todos={todos}></TodoApp> 
  </TabPane>
</Tabs>
```
## 最后一步

我们甚至可以将我们之前的TODOMVC + HelloWorld放置到Content。
一切都是可组合的，就如同你使用html标签一样，不过regularjs的组件化与web component 完全不冲突，它基于自建的解析器，所以regularjs不仅仅可以无缝集成与目前的任何框架，同时也顺应未来趋势，你目前所做的基于regularjs的封装，在未来也足够，至少规范内的webcomponent的数据驱动模板的能力是非常弱的，而regularjs正好可以弥补这一点。

下一节，我们将会来学习，如何使用regular-register 来一键转化regularjs组件为规范的custom-element。
