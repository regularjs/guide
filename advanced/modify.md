# 实例化劫持

Regular在`v0.6`版本引入了新生命周期hook`modifyBodyComponent`，这个hook用来劫持到内部组件的实例化动作。

> __`modifyBodyComponent( component, next )`__

- `component`: 内部实例化的组件
- `next( component )`: 决定是否调用上层嵌套的modifyBodyComponent



## 起步

```js

const EventBusProvider = Regular.extend({
    name: 'EventBusProvider',
    config(){
        const emitter = new Regular;
        this.$broadcast = emitter.$emit.bind(emitter)
        this.$subscribe = emitter.$on.bind(emitter)
    },
    modifyBodyComponent( component ){
        // 为组件注入这个全局的事件中介者
        component.$broadcast = this.$broadcast; 
        component.$subscribe = this.$subscribe;
    }

})

```

这样内部包裹的所有组件（包括组件的子组件）都可以使用到EventBus

__⚠️ 这个hook在compile 之后，但在init之前触发__

```js

const Button = Regular.extend({
    name: 'Button',
    template: `
        <button>JUST Button</button>
    `,
    config(){
        console.log('before compile: ' + this.$broadcast) // undefined
    },
    init(){
        console.log('after compile: ' + this.$broadcast) // Function
    }
})



new Regular({
    template: `
        <EventBusProvider>
            <Button />
        </EventBusProvider>
    `
}).$inject('body')

```



## 条件控制

我们发现一个问题，这样所有的内部组件都会被劫持修改，如何限制在某些条件下才注入呢？

你可以通过 __标记__ 的方式来选择被注入的组件

```js

modifyBodyComponent( component ){

    // 只有被marked标记的组件会被劫持注入
    if( component.data.marked ){
        component.$broadcast = this.$broadcast;
    }

}
```

__使用__

```html

<EventBusProvider>
    <Button marked />
    <Button />
</EventBusProvider>
```

这样就只有`<Button marked />`会被注入了


## 使用next参数控制嵌套的modifyBodyComponent

很多有时候，会有嵌套的
```html
<OtherProvider>
    <EventBusProvider>
        <Button />
    </EventBusProvider>
</OtherProvider>
```

默认情况下，Button不会被`<OtherProvider>`处理，
但你可以通过`modifyBodyComponent`的第二个参数进行控制


```js

const EventBusProvider = Regular.extend({
    name: 'EventBusProvider',
    config(){
        const emitter = new Regular;
        this.$broadcast = emitter.$emit.bind(emitter)
        this.$subscribe = emitter.$on.bind(emitter)
    },
    modifyBodyComponent( component, next ){
        // 为组件注入这个全局的事件中介者
        component.$broadcast = this.$broadcast; 
        component.$subscribe = this.$subscribe;

        // ⚠️通过next调用的位置，即调用OtherProvider#modifyBodyComponent的位置
        next(component)
    }

})

```

__注意点__

- 通过`next`来调用上层的modifyBodyComponent逻辑
- 你可以控制`next`的调用位置来控制外层修饰器的执行位置（之前、之后）




## 下一步阅读

如果你暂时不知道如何应用`modifyBodyComponent`，请参考[专题：组件通信](../topic/communication.md)





