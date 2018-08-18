
# 风格指南 - styleguide

与类似文档一样，Regular 将风格指南设置为了多个优先级，分别是

- __必要的__: 程序运行可能会出问题的，强制遵循
- __建议的__: 不遵循程序可以运行，但会引起可维护性或性能的问题
- __谨慎使用的__: 未来可能会废弃的使用方式，谨慎使用

## 必要的

### 禁止在extend中定义缺省data参数 {}

在 `config` 生命周期中处理默认参数，而不是的 `extend` 时定义

__Bad__

```js
Regular.extend({
    data: {
        list: [1,2,3]
    }
})
```

__Good__

```js
Regular.extend({
    config( data ){
       data.list = data.list || [1,2,3] 
    }
})
```


__Very Good__

更好的做法是一个一致的缺省参数逻辑, 比如使用`util.extend`(会默认添加未定义的值)

```js

const extend = Regular.util.extend;

Regular.extend({
    config( data ){
        extend(data, {
            list: [ 1, 2, 3 ]
        })
    }
})
```


__ 未来 Regular 会提供统一的 default 书写方式 __(会结合入参的检验机制共同设计)。



> 谨记 extend 是原型继承的语法糖，所以原型上的定义都是实例公用的

__参考__

- [组件:默认参数](../basic/component#default)




### 自定义destroy 必须调用 `this.supr()` {#destroy}

由于一些历史原因，Regular有一个肮脏的设计：即`destory`既被定义为生命周期钩子方法，又是一个对外的`public` API。

为了确保组件回收的统一逻辑,请调用 `this.supr()` 来引入`Regular.prototype.destory` 中的回收逻辑

__Bad__

```js

const Component = Regular.extend({
    destory(){
       window.removeEventListener('scroll', this.onScroll)
    }    
})

```

__Good__

```js
const Component = Regular.extend({
    destory(){
        this.supr()
        window.removeEventListener('scroll', this.onScroll)
    }    
})
```

## 建议的


### 大

### list渲染尽量加入 `by` 条件


__Good__

```html
<tr>
{#list items as item by item_index}
    <td>{item.content}</td>
{/list}
</tr>
```


__Bad__


```html
{#list items as item}
    <td>{item.content}</td>
{/list}
```

> 但并非所有场景都可以使用 `track by` 进行控制，请参考 [list语句章节](../basic/statement/list.md) 


__参考__

- [专题：性能优化的几个建议](../topic/performance.md#list)

### 组件命名 - 大写驼峰

Regular 本身并无强限制组件的命名方式。

建议以 __大写驼峰__ 的方式进行组件命名，并且 __类名和 `name` 统一__

__Bad__

```js
const ConfirmModal = Regular.extend({
    name: 'confirm-modal'
})

```


__Good__

```js

const ConfirmModal = Regular.extend({
    name: 'ConfirmModal',
    // 略
})

```





## 谨慎使用的


### 不要用if语句去控制属性的增删

if语句其实可以使用在节点属性上，但已经不建议大家这么做

__Bad__

```html
<input {#if required} required {/if} />
<div {#if active} on-click={this.clickMe()} {/if} ></div>
```

__Good__

相关逻辑迁移到JS

```html
// Regular会自动转义类似required、readonly 等 Boolean 类属性
<input required={required} />
```

```js

Regular.extend({
    template: `
        <div on-click={this.clickMe()}></div>
    `,
    clickMe(){
        // 在js中控制
        if( !this.data.active ) return;
    }
})

```

__理由__

使用if语句去控制属性有几个风险

- 存在自定义指令未实现 destroy 函数的可能，进而导致 Bug
- 这种在模板里夹杂大量逻辑的写法会引起可维护性降低
- __未来可能会移除这个Feature__


### 事件与双向绑定



__Bad__

```js

const Input2 = Regular.extend({
    name: 'Input2',
    template: `<input on-change={this.changeValue($event)} />`
    changeValue(ev){
        this.data.value = ev.target.value;
        this.$emit('change'); // emit change event
    }
})

```

```js

new Regular({
    template: `
        <Input2 value={value} on-change={this.handleValue()} />
    `,

    handleValue(){
        console.log(this.data.value) // 返回的仍然是上一个值
    }

}).$inject('body')

```

这里你会发现返回的仍然是上一个值

__为什么?__

因为触发事件的时候，并没有进入脏检查，外层的数据其实还未被同步。

__Not So Bad__


```js
const Input2 = Regular.extend({
    name: 'Input2',
    template: `<input on-change={this.changeValue($event)} />`
    changeValue(ev){
        this.data.value = ev.target.value;
        setTimeout(()=>{
            this.$emit('change'); //emit 
        },0)
    }
})
```

当通过类似`setTimeout`将其延迟到脏检查之后的时机触发，此时的结果就如预期了。


__Good__

> @TODO: new feature required




