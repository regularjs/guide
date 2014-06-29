# Static(Global) Method


## Component.extend(specification)

- specification `Object`

create a new Component inherited from another Component. 

1. __template__ `AST|String|Selector`
  * 节点的选择器(字符参数都会先作为选择器匹配，对于如要适配不支持querySelector的浏览器，只能传入id选择器)
  * 模板字符串
  * 预解析的AST(via `new Parser(str).parse()`)

2. __[Function]   init()__: 
  
  初始化函数, 这个在组件$compile之后调用(此时已经生成了dom结构)

3. [Function]   config(data): 

  数据预处理函数，这个在组件compile之前调用

4. [Function]   destroy: 

  销毁函数 , __注意__ 如果要自定义回收函数，务必调用父类destroy(`this.supr`)来销毁掉一些通用部分(如事件监听，数据监听)

5. [String]     name: 

  组件名， 使得此组件可以以这个节点名内嵌到其它组件内如 `<pager current={{current}}/>`, pager就是定义的name, __注意__ 如果template是传入的script节点，会获取节点的name属性作为组件名


__


__Example__


* the method is availiable in  Component