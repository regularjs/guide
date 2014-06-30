# 逻辑控制 if/ifelse/else

与其它模板引擎(如freemarker)一样, regular也提供了`if`,`elseif`,`else`等语法元素提供对逻辑控制的支持

__Example__


```mustache
{{#if user.age >= 80 }}
  you are too old 
{{#elseif user.age <= 10}}
  you are too young
{{#else}}
  Welcome, Friend
{{/if}}
```

这里的`you are too old`等都称之为block(块) 根据判断表达式是否为真, 判断是否显示某个block或让某个block回收. 


> 在regular中，`{{#}}`开头的被视为内建规则的开始，就如`<TagName>`之于html



