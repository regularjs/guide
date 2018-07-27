### 背景

在组件化不断深入的大环境下，无论使用哪种 MDV 框架都最终会遇到一个头疼的问题，就是「跨组件通信」。

下图是个简单的例子（ 为了方便起见，我把每个组件的模板都放在了一张图进行描述 ）

<img width = 80%  src='http://p1.music.126.net/h1WXEc1SuukxJxLWjKPK3Q==/109951163238805807.png' />

这里包含「事件通信」和「数据通信」两个维度。

__事件传递__

为了将事件 `click` 从 `<LeafNode />` 传递到最外层组件，需要依次通过 `<SubNode />` 和 `<Sub />` 等可能本不关心这个事件的组件（即使例子里已经使用了proxy的简化语法）

__数据传递__

为了从 `<Top />` 传递 `title` 这个 prop 到 `<LeafNode />` , 需要层层跨越 `<Sub />`、`<SubNode />` 这些本不需要关心 `title`属性 的组件。



以上处理方式除了带来性能上的损耗之外，更麻烦的就是造成了可维护性的急速下降。 


### 显而易见的事件通信解决方案

 最直接的做法就是引入一个「中介者」，简而言之就是一个全局的「跳板」，下例就是一个事件中介者


__mediator.js__

```js

const Regular = require('regularjs');
const emitter = new Regular;//每个Regular组件都是一个事件发射器

module.exports = {
    broadcast: emiter.$emit.bind(emiter),
    subscribe: emiter.$on.bind(emiter)
}

```


__Top.js__

```js

const { broadcast, subscribe } = require('./mediator')
const Regular = require('regularjs');

const Top = Regular.extend({

    name: 'Top',

    init(){
        subscribe('check', ev =>{
            // 通过emitter广播事件
        })
    }
})



```

__LeafNode.js__


```js

const { broadcast, subscribe } = require('path/to/mediator')
const Regular = require('regularjs');

const LeafNode = Regular.extend({

    template: `<div on-click={ this.onClick() } ></div>`,

    name: 'LeafNode',

    onClick(){
        broadcast( 'check', { type: 'leafnode' } )
    }
})

```


__`mediator`__ 作为一个全局单例直接被 `LeafNode` 和 `Top` 引用，通过它实现了直接通信.

_更麻烦的兄弟节点之间的通信当然也可以这样来解决。_

### 显而易见的解决方案引出的另一个显而易见的问题

上述中介者的引入的最大问题就是，所有相关组件都在 __定义时__ 引入了对`emitter`的 __全局耦合__， 这个将导致组件无法在多工程间被复用。



__一种合理的解决方案就是将对`emitter`的耦合, 延迟到实例化阶段。 __

在Regular之前的版本里，很多朋友会通过`this.$parent`或`this.$outer`等可控性很差的方式来实现，在`v0.6`有了一种更好的方式。


### `modifyBodyComponent` 新生命周期

在 Regular 的 `v0.6` 引入了一个新的生命周期叫 `modifyBodyComponent` ，它用来劫持到组件包裹的所有内部组件的初始化周期。


我们用一个简单例子来实现下`emitter`的动态注入

__Broadcastor.js__

```js


const Regular = require('regularjs');

const Broadcastor = Regular.extend({

    name: 'Broadcastor',

    config( data ){
        const emitter = data.emitter;
        this._broadcast = emitter.$emit.bind(emitter),
        this._subscribe =  emitter.$on.bind(emitter)


    },
    
    modifyBodyComponent( component, next ){
    
        component.$broadcast = this._broadcast;
        component.$subscribe = this._subscribe;

        next(component) // 交给外层的包装器
    }
})

```





__Top.js__

```js

// const { broadcast, subscribe } = require('./mediator')
const Regular = require('regularjs');

const Top = Regular.extend({

    name: 'Top',

    template: '略...',

    init(){
        this.$subscribe('check', ev =>{
            // 通过emitter广播事件
        })
    }
})



```

__LeafNode.js__


```js

// const { broadcast, subscribe } = require('path/to/mediator')
const Regular = require('regularjs');

const LeafNode = Regular.extend({

    template: `<div on-click={ this.onClick() } ></div>`,

    name: 'LeafNode',

    onClick(){
        this.$broadcast( 'check', { type: 'leafnode' } )
    }
})

```


__main.js__ (入口)


```js

new Regular({
    template:`
        <Broadcastor emitter={emitter}>
            <!-- 其中LeafNode 在Top内部 -->
            <Top />
        </Broadcastor>
    `,
    data: {
        emitter: new Regular
    }
})

```


这样所有的组件声明都取消了对全局 `emitter` 的直接依赖，而是在入口(`main.js`) 动态传入了一个`emitter`。


#### 生命周期

需要注意的是`modifyBodyComponent` 会在 component本身`compile`之后运行, 但在`init`之前运行。以上面的例子为代表, 完整生命周期如下.

```shell

Broadcastor.config -> Broadcastor.compile
    - Top.config -> Top.compile
        - LeafNode.config -> LeafNode.compile
            - Broadcastor.modifyBodyComponent(LeafNode)
        - LeafNode.init
        - Broadcastor.modifyBodyComponent(Top)
    - Top.init
- Broadcastor.init

```




> 下一篇，应该会以redux(rgl-redux)为例，介绍一种基于modifyBodyComponent来解决跨组件的数据通信的方式
