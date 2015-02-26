
# Regularjs是什么

__Regularjs是基于动态模板实现的用于构建数据驱动型组件的新一代类库__

## 关键词

### 1. 动态模板引擎
关于前端的模板技术， 我在前端乱炖有一篇反响还算不错的综合性文章——[一个对前端模板技术的全面总结](http://www.html-js.com/article/2313)， 总体来讲动态模板引擎是一种介于常规字符串模板(jade, ejs)和Dom模板(angulrjs, vuejs)之间的模板技术, 它保证了regularjs的: 

1. 数据驱动的开发模式
2. 100%的独立性

一个regularjs组件的模板写法类似这样

```html
<div class="m-notify m-notify-{position}">
  {#list messages as msg}
  <div class="notify notify-{msg.type||'info'}" >
    <div class="glyphicon glyphicon-{iconMap[msg.type]}"></div>
    <span class="notify_close" on-click={this.clear(msg)}>×</span>
    {#if needTitle}
    <h4 class="notify_title">{msg.title}</h4>
    {/if}
    <p class="notify_message">{msg.message}</p>
  </div>
  {/list}
</div>
```

非常接近于我们使用字符串模板的体验. 但是不同的时， 它编译生成的不是字符串而是__Living dom__, 使得view是会随着数据变化的， 相信你也看到了模板中有类似`on-click`的属性， 因为其实compile结束之后， regularjs与angularjs产生的__Living Dom__已经没有本质区别，由于也是基于脏检查的设定， 事实上后续使用会非常接近angularjs.


### 2. 数据驱动

> - 强制数据模型抽象是__因__
> - 数据驱动的开发模式是__果__

数据驱动即强制将你的业务逻辑抽象为数据（状态）的变化， 这样原本琐碎的前端开发会更加贴近与编程本质（算法 + 数据结构）, 带来的开发体验上的进步事实上早已被angularjs或更骨灰的knockout框架所验证.

当然数据驱动的开发模式同时也带来一些不便， 比如: 

1. 无法处理复杂的动画
2. 可控性不如直接的dom操作

数据模型抽象的方式有很多种， 但是目前不外乎以下几种:

- 脏检查
  - 数据模型的脏检查(angularjs / regularjs) 
  - view抽象的脏检查(react以及雨后春笋般的基于virtual dom的库或框架)
- 存取器
  - 计算属性: defineProperty(vuejs, 黑科技avalonjs)
  - 常规的setter/getter函数(Backbone, knockoutjs, ractivejs)



对于这个点， 本来也有一篇长文正在撰写， 但是这篇[2015前端框架何去何从](http://www.cnblogs.com/sskyy/p/4264371.html)差不多说出了我的心声， 推荐大家阅读.



### 3. 组件

随着angularjs等框架的大行其道， bootstrap等ui框架也提供了很多标签上直接可配的使用方式. 大部分的人脑中对__组件化__的理解似乎开始停留在了__【标签化】__这个层级上, 事实上组件的定义从来不曾改变过: 

> 在前端开发领域， 组件应该是一种独立的、可复用的交互元素的封装

而在基于特定框架/类库之下， 组件会被强加一种特定的构建方式. 就如:

- regularjs中， 组件被拆分为了: 模板template + 数据data + 业务逻辑(实例函数)的组合, 每一份组件可以视为一个小型的mvvm系统. 
- react中， 组件被拆分为了: state + virtual-dom声明(render函数) + 业务逻辑的组合
- angularjs1.x版本中， 事实上它的组件化是不纯粹的， 推荐大家看下2.0的设计

一个典型的例子就是regularjs中组件的两种使用方式: 

- js中实例化

  ```js
  var pager = new Pager({
    data: {
      current: 1,
      total: 10
    }
  })
  ```

- 模板中实例化

  ```html
  <pager current=1 total=100></pager>
  ```

它们带来的结果是一致的， 我们可以看到标签化只是组件的一种使用方式, 或是一种在模板中的接口形式， 关键是组件内部的业务(领域)模型, 并且由于数据驱动的特性， 在mvvm模式下， __并不是所有可复用的交互元素都适合封装成组件__. 关于这点[@民工精髓的这篇文章差不多说到了点子上](https://github.com/xufei/ng-control/issues/2).

组件与事件系统没有直接关系, 但是一般而言，一个功能良好的组件会通过抛出事件来与外部系统进行沟通.


这里，是一个比较典型的基于regularjs构建的[Tabs组件](http://plnkr.co/edit/yzmkZhHZGiCwV3yBwcwb?p=preview). 

```html
<Tabs ref="tabs">
  <TabPane title="<strong>Inbox</strong> <span class='badge'>{user.unread_messages_count}</span>" on-active={user.unread_messages_count+=2} >
    Your username is: <strong>{user.username}</strong>
    <input r-model={user.username}  >
  </TabPane>
  {#list todos as item}
    <TabPane title="Tab {item_index+1} " >
      Content of the first tab + {item} + {user.username}
    </TabPane>
  {/list}
</Tabs>
<hr>
<div>
  <button on-click={this.$refs.tabs.selectTab(0)}>Select first tab</button>
  <button on-click={this.$refs.tabs.selectTab(1)}>Select second tab</button>
  <button on-click={this.$refs.tabs.selectTab(2)}>Select third tab</button>
</div>
```

大家可以与其他比如angularjs或react做下对比.


### 4. 类库

类库代表regularjs具有100%的独立性.

1. 无依赖
2. 每个组件生命周期完全自治， 只有一个独立的model, 不会像angular一样创建出深度的原型继承，使用上让人困惑的scope.
3. 不会引入框架级的设施: 模块系统 + 模板加载 + 路由. 但是不证明它不能支持， 目前regularjs支持browserify, requirejs的插件预解析模板文件. 打包后的文件为一个标准的UMD模块， 可以在commonjs, AMD, Globals下使用. 路由的话可以使用regular-state来创建深层次的单页应用, 这个已经在实际产品中被实践过， 。 
4. 大小
  对比后其实你会发现， regularjs的大小始终维持在50kb, 对于同类的ractivejs, reactjs, angularjs动辄200kb+的大小， 它称为类库可谓__非常厚道__


相对精简的内核是regularjs成为一个能屈能伸的, 并对其他框架或类库友好的关键所在.



### 5. __新__一代__类库__

现在声称的下一代(Next-generation)框架越来越多了， 但是本质永远不会变(从根本和可能性讨论问题， 程序员之间的扯皮其实是可以避免的 :) ， 即

> 下一代框架应该顺序前端开发的趋势和潮流

我们目前就可以看得到得趋势有: 

1. web component: polymer x-tags
2. 动画: material design等设计趋势, 硬件和浏览器的更新
3. 同构的javascript: 这一般会包含两个组成方面: __单页应用__与 __路由系统__. 我可以负责任的说， 目前的基于框架的同构app实现基本还处于玩具级别, DEMO和产品的性质是不同的
4. ES6/7: Object.observe / class/ imports等
5. ....

在这些部分， regularjs有些完成了一些工作， 而有些还正在进行(但是已经确保可能性).


## regularjs有哪些特性

在实际使用中， 你会发现， regularjs就如我发布初期的slogan: 

> regularjs = reactjs(ractivejs) + angularjs

在regularjs仅仅50kb的身材之下, 你能看到一些react, angularjs以及ractive的影子， __后来者往往有社区上的劣势， 但换句话说它没有任何历史包袱, 在设计中去糟存精使得regularjs更加易用__. 当然它绝对不是特性整合这么简单, 
它同时也提供了独一无二的特性来帮助我们实现卓有成效的组件级开发. 

我们先简单看下regularjs的特性支持: 

0. 几乎完备ES5表达式支持
1. 指令/过滤器(双向)
2. 一致的事件系统
3. 动画系统
4. 单页面支持: 需配合regular-state模块
5. 内嵌组件 + 内嵌内容(transclued content)
6. 良好的封装性和扩展性
7. ....


__哦， 对了， 目前regularjs仍然支持IE6__

这是一个令人羞愧的设定， 与作者所在的环境也有直接关系， 但是对于那些可能也需要支持IE6的朋友们， regularjs可能是一个比较安全的选择. 

regularjs未来会拉出一个支持度接近vuejs的版本， 但是特性不会发生改变， 大家可以放心使用。 regularjs目前已经在大大小小多个线上产品中使用了， 也收集了一些有效的建议.

-------

好了， 该看下一个最简单的regularjs组件长什么样吧..
