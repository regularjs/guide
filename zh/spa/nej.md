# 与NEJ Module结合

网易内部有大量的用户，使用的单页方案都是『NEJ的umi调度系统』，由于单页系统中单个模块逻辑较小，很多时候只需要一个Regular组件即可。

所以经常会有同事写出这种重复的代码，把一个大的Regular组件插入到空空的NEJ模块中：

NEJ模块的html文件（`module/test/index.html`）：
```html
<meta charset="utf-8">
<textarea name="ntp" id="module-test">
    <div class="j-flag"></div>
</textarea>
<!-- @TEMPLATE -->
<textarea name="js" data-src="./index.js"></textarea>
<!-- /@TEMPLATE -->
```

NEJ模块的js文件（`module/test/index.js`）：
```javascript
_pro.__onShow = function(_options) {
    new TestComponent({
        data: {...}
    }).$inject(this.__eFlag);
    ...
}
```

或者是这样，把大模块的功能拆成几个小组件分别插入到空空的NEJ模块中：

NEJ模块的html文件（`module/test/index.html`）：
```html
<meta charset="utf-8">
<textarea name="ntp" id="module-test">
    <div class="j-flag"></div>
    <div class="j-flag"></div>
    <div class="j-flag"></div>
</textarea>
<!-- @TEMPLATE -->
<textarea name="js" data-src="./index.js"></textarea>
<!-- /@TEMPLATE -->
```

NEJ模块的js文件（`module/test/index.js`）：
```javascript
_pro.__onShow = function(_options) {
    new TestTab(...).$inject(this.__eFlags[0]);
    new TestSummary(...).$inject(this.__eFlags[1]);
    new TestDetail(...).$inject(this.__eFlags[2]);
    ...
}
```

在一个项目中，如果一两个模块这样做可以容忍，但是多了就会有点小抓狂。

其实我们想要的功能很简单——用NEJ的umi调度系统直接路由Regular组件。

对此，@赵雨森同学 在NEJ里封装了一个RegularModule的util（在NEJ目录下`util/dispatcher/regularModule`）。

## RegularModule使用指南

### 1. 直接在模块中上Regular

直接在NEJ的`module`目录下写Regular代码，方式和写Regular的其他组件一样。

Regular模块的js文件（`module/test/index.js`）：

```javascript
define([
    'regular!./index.html'
    ...
], function(template, ...) {
    var TestModule = Component.extend({
        template: template,
        config: function() {
            ...
        }
    });
    return TestModule;
});
```

Regular模块的html文件（`module/test/index.html`）：

```html
<div on-click={this.soEasy()}>{'按Regular模板写就行'}</div>
```

### 2. 在模块的js文件中注册模块

对于上面的Regular模块组件，NEJ肯定调度不了的。接下来就要引入RegularModule，并注册umi：

```javascript
define([
    'util/dispatcher/regularModule',
    'regular!./index.html'
    ...
], function(_m, template, ...) {
    var TestModule = Component.extend({
        template: template,
        config: function() {
            ...
        }
    });
    return _m._$regist('test', TestModule);    // 注册umi
});
```

### 3. 添加模块配置

最后一步，也是最关键的一步，在模块配置文件中添加配置。

这与以往的NEJ模块不同，要用js的方式把该模块引入，然后添加到相应的位置：

```javascript
NEJ.define([
    'base/klass',
    'base/util',
    'util/dispatcher/dispatcher',
    'pro/widget/module',
    '{pro}../html/module/test/index.js'
], function(_k, _u, _s, _m, _$$TestModule, _p){
    /**
     * 启动模块配置
     */
    _pro.__startup = function() {
        _t._$startup({
            // 规则配置
            rules: {
                title: {
                    '/m/test/': 'Test模块',
                    ...
                },
                alias: {
                    'test': '/m/test/',
                    ...
                }
            },
            // 模块配置
            modules: {
                '/m/test/': _$$TestModule,
                // '/m/test/': 'module/test/index.html',    // 原来的配置
                ...
            }
        });
    }
});
```

这样就大功告成了。

### 补充1：NEJ的模块方法

NEJ的模块方法在RegularModule中可以继续用，例如：

```javascript
define([
    'util/dispatcher/regularModule',
    'regular!./index.html'
    ...
], function(_m, template, ...) {
    var TestModule = Component.extend({
        template: template,
        config: function() {
            ...
        },
        __onShow: function(_options) {
            console.log('show', _options);
        },
        __onRefresh: function(_options) {
            console.log('refresh', _options);
        },
        __onMessage: function(_options) {
            console.log('message', _options);
        },
        __onBeforeHide: function(_options) {
            console.log('beforeHide', _options);
        },
        __onHide: function() {
            console.log('hide');
        }
    });
    return _m._$regist('test', TestModule);
});
```

### 补充2：模块组件切换时的重置问题

默认情况下，当模块切换出去再切换进来，即`__onHide`再`__onShow`时，Regular组件是**不会销毁**的。

但有些情况下，比如一些表单模块或者要刷新的列表模块，我们希望模块切换后整个组件的内容重置。

可以自己实现`reset`方法，在`__onHide`时把组件中的`data`清理一次，但这样有些麻烦。

在RegularModule中有另一种方法，在`__onHide`时把这个组件destroy掉，在`__onShow`时RegularModule会重新构建这个组件。示例如下：

```javascript
define([
    'util/dispatcher/regularModule',
    'regular!./index.html'
    ...
], function(_m, template, ...) {
    var TestModule = Component.extend({
        template: template,
        config: function() {
            ...
        },
        __onHide: function() {
            this.destroy();    // 起到reset的作用
        }
    });
    return _m._$regist('test', TestModule);
});
```