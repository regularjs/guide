
# 服务端渲染


## 流程图

Regular服务端渲染的基本流程如下

![](https://p1.music.126.net/LS_4PgIM3BOyzdOEKR9O_Q==/109951163464384469.png)


__任务拆解__

- 后端
    - 根据组件输出首屏字符串
    - 注入首屏数据到html中
- 前端
    - 根据组件以及后端注入的首屏数据激活DOM，完成数据绑定和事件、指令等初始化


__本文依赖__

- [koa@v2](https://koajs.com/): 用于创建简单的render server
- [webpack@v4](https://webpack.js.org/): 用于打包标准模块到前台使用



