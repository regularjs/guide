#前言

看到regular的名字就能感受到扑面而来的山寨味，在开始前，我还是要说明下regularjs出现绝对不仅仅是作者的造轮子情绪泛滥的结果


## angularjs的火爆以及它的小伙伴们

[angularjs](https://angularjs.org/)从12年开始开始火爆起来，数据驱动的业务实现方式也由此深入人心，它的数据更新策略基于脏检查，在明确内部的生命周期后在数据绑定的使用上是最为灵活的(即这种方式不介意是何种方式促使数据改变，而只关心数据改变的结果)，作者本人以及周围的小伙伴也开始为之着迷。随着使用的深入，发现angularjs的强大特性也引出了一些无法攻克的不足:

  1. 由于本身生命周期的强约束，难以与其它框架共用
  2. 入门容易，深入难 —— 想想directive一个feature就涉及到的 postlink prelink controller compile scope等等概念。
  3. 模板的逻辑实现依赖的是directive(`ng-repeat`, `ng-if` etc..)，即最小逻辑颗粒是节点，与常规的模板自由度上还是有较大差异。
  4. FOUC(Flash of unstyled content)，因为angular是先通过浏览器(innerHTML)生成了dom，再后置link来产生真正需要的元素，所以会导致内容闪动。regular也没有完美的解决问题(因为内容仍然是前端render的)，但是可以保证进入文档的节点就是预期的节点

除此之外，angularjs的核心是scope对象，业务的实现大部分都是在scope上动态添加函数或属性。也有人提出整个controller的写法缺乏约束性，这个时候[__angular-classy__](http://davej.github.io/angular-classy/)出现，它将原本因挂载在scope上的业务逻辑转移到构造函数原型的形式，减少了灵活度，但是更有约束性，这也给了regular很大灵感。

在angular大行其道的时期也激励产生了很多框架，比如[vue.js](http://vuejs.org/)、[avalon.js](https://github.com/RubyLouvre/avalon)、[reactive](https://github.com/component/reactive)等等优秀的框架，它们解决了一些问题，比如avalon.js利用defineProperty实现了数据get-set的代理 并利用VB实现了ie6的兼容(当然数组还是wrap)，但总体来讲基于dom实现的新秀们还是缺少足够的差异化(代码量的减少并不是最核心的部分)


## 新思维的出现——react ractive

与此同时，[react](http://facebook.github.io/react/)的出现让这个百花齐放但缺少差异化的阶段注入了一些不一样的味道，它可以实现了另一种内建的生命周期(lifecycle)，在不依赖数据层面的脏检查的同时，建立了ui与数据之间的连接。它将diff职责放到了一个dom结构的抽象[virtual dom](http://fluentconf.com/fluent2014/public/schedule/detail/32395)上，通过脏检查两次render之间virtual-dom发生的变化来更新u。不过如果移除了jsx的依赖，手动通过嵌套函数的方式创建virtual-dom(如下例)简直不可忍，并且它的组件展现中的逻辑控制完全依赖于js的语言能力，往往不像利用模板构建那么清晰(当然react的作者有它自己的说法，仁者见仁了)。

```js
render: function() {
  return (
    React.DOM.div(null, 
      React.DOM.h3(null, "TODO"),
      TodoList( {items:this.state.items} ),
      React.DOM.form( {onSubmit:this.handleSubmit}, 
        React.DOM.input( {onChange:this.onChange, value:this.state.text} ),
        React.DOM.button(null, 'Add #' + (this.state.items.length + 1))
      )
    )
  );
}
```

同期[ractive](http://www.ractivejs.org/)也悄然出世，几乎就是作者需要的那个菜了。可惜ractive的ui事件系统是通过代理事件的形式，你仍需要在init里去处理，这样一是弱化了声明式的意味，二是必然要杂糅进dom操作。并且数据更新上是采用的提取依赖关系的方式并提供set函数，这种方式对于习惯了angular的脏检查的人来讲无疑会带来很多不利。


由于react在使用上逻辑上可以几乎理解为'full-refresh'对使用者有巨大的吸引力，最初版本的regular也是旨在替换掉react的js+jsx而是与ractive一样定义一种模板语言来描述结构，在diff策略上沿用virtual-dom的思想。在实现的过程渐渐发现，虽然基于virtual-dom的策略无需去绑定大量的watcher，但仍然引入了一些实现上和使用上的难题

1. 一次digest中virtual-dom的diff只需一次，但是会随着ui的复杂度，性能损耗严重，virtual-dom与原dom的对应也更难(如果angular的脏检查的性能取决与watcher的数量，那react则是取决与ui规模)
2. virtual-dom的内部结构变化是不可预知的
  
  比如
  ```js
  var MyComponent = React.createClass({
    render: function() {
      if (this.props.first) {
        return <div className="first"><span>A Span</span></div>;
      } else {
        return <div className="second"><p>A Paragraph</p></div>;
      }
    }
  });
  ```

  在props.first发生改变时，发生的其实仅仅只是同一个节点的className在first和second的切换。由于这种未知性，永远无法在react中出现类似directive的节点增强或包装器，所有事件也必须以数据代理的形式



## regular的产生和取舍

regular正是在这种百花齐放的时候产生，最终在实现上采取了angular的数据更新策略(但是提取了表达式的依赖关系以便在Object.observe正式到来时切换到脏检查+observe的形式)提倡极致的声明式和裸数据操作，依赖于基于字符串的模板描述结构结合更规范性的类式继承的组件体系来定义数据层的业务逻辑。

> __这也是框架取名 regular = react(ractive) + angular的由来 __
