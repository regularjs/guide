# 小节

经过本章的学习， 我们理解了

- 每一个regularjs组件类都拥有以下类方法用来定义或扩展组件能力
    1. extend
    2. implement
    3. directive
    4. filter
    5. event
    6. animation
    7. component
    8. use

- 扩展都具有单向性， 使得 implement/directive/filter/event/animation/component 都只会作用于本组件或子类组件

- 鉴于这个单向性， 我们可以在每个工程中定义一个“命名空间”来实现本工程对外的隔离性

- 我们应该怎么来定义一个插件， 并使用use来使用这个插件
