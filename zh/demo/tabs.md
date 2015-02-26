
# 使用regularjs实现一个典型的Tabs组件

Tabs是一个常见的组件， 通过本文一步步学习制作一个Tabs组件 你将会了解到: 

1. regularjs中的"transcluded content"(内嵌内容) ，并且结合占位`<r-content>`引入这段内容.
2. regularjs组件之间的自由组合

__注意__

本文的例子修改自于一个一位网友的Issue， 组件的命名会贴近于React的方式， 使用驼峰的方式 

__使用到的其它资源__

1. multiline: 一个其实已经很原始的书写多行字符串的trick, 现在被人封装成了库， 它可以避免我们在代码中拼接字符串模板
2. bootstrap: Tabs样式， 拿来主义.

## 最终Tabs的使用效果

在开始之前， 我们先直接展示我们最终达到的效果.

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

跟react, angular之类的版本非常接近. Tabs即我们要创造的切换组件， 它的内嵌内容是若干个TabPane组件. 


这个例子很简单， 但是它有两层的内嵌内容， 所以很适合作为例子来帮助我们例子内嵌内容. 


不要急着看看代码， 让我们先一步步分解需求来实现效果.


## 需求分析

要实现




__App组件的创建时发生的那些事儿__

当我们调用new App()时， 期间的各组件生命周期中的关键顺序如下: 

```coffeescript
App config => App compile(which will initialize the Tabs)
    => Tabs config => Tabs  compile (which will intialize the TabPane)
        =>  TabPane1 config => TabPane1 compile => TabPane1 init
        =>  TabPane2 config => TabPane2 compile => TabPane2 init
     => Tabs init
App init;
```

即在TabPane创建时， 其实Tabs的应用已经存在了， regularjs中， 

__如果组件是其它组件的内嵌内容, 那你可以通过`$outer`来获取这个外部引用__

_结合[组件生命周期](../concept/lifecyle.md)来加深理解_

借由这个原理， 我们可以在TabPane的config时， 通过this.$outer获得它外层的组件(即Tabs).

```
var TabPane = Regular.extend({
    // ... code
    config: function(){
        if(this.$outer) this.$outer.data.tabs.push(this);
    }
    // ... 
})
```





## 为何不使用传参， 而使用内嵌内容来实现

其实， 我们可以以一种更简单的方式来实现Tabs组件

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

其实作者也经常在实际产品开发阶段使用上面这种直接传参的 快刀斩乱麻的方式. 

因为很明显，这种方式的实现更加简单， 但是在使用Tabs组件时， 内嵌内容的版本显然可以带来带来最佳的可读性。

关于MVVM时代的控件封装的取舍， 可以参考下[民工精髓的这篇文章](https://github.com/xufei/ng-control/issues/2)。

还有一个无法取代内嵌内容的原因是， __通过include引入的话， 模板的context是指向tabs组件的， 但是`<r-content>`的话， 内嵌内容的context是指向声明它的组件的， 即上例的App__, 所以我们发现{user.name}等插值都没有显示， 因为在tabs中并没有定义user对象， 这又是一个使用性上的天然优势. 否则你需要再传入user对象给tab组件.

```
<tabs user={user}></tabs>
```

这显然无形中让这个tabs变得不那么通用了.

## 废物利用下， 我们之前写完的TODOMVC组件和HelloRegular组件...

regularjs的主题是使用动态模板来书写数据驱动的组件， 而组件的特点就是可以通过声明来组合使用

还记得大明湖畔的HelloRegular与TodoMVC吗？ 我们会


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

我们甚至可以将我们之前的TODOMVC + HelloWorld 放置到Content.
一切都是可组合的， 就如同你使用html标签一样， 不过regularjs的组件化与web component 完全不冲突， 它基于自建的解析器， 所以regularjs不仅仅可以无缝集成与目前的任何框架， 同时也顺应未来趋势， 你目前所做的基于regularjs的封装， 在未来也足够， 至少规范内的webcomponent的数据驱动模板的能力是非常弱的，而regularjs正好可以弥补这一点。

下一节， 我们将会来学习， 如何使用regular-register 来一键转化regularjs组件为规范的custom-element.
