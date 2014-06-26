# 逻辑控制 if/ifelse/else

与其它模板引擎(如freemarker)一样, regular也提供了`if`,`elseif`,`else`等语法元素提供对逻辑控制的支持

__Example__


```javascript
{{#if user.age >= 80 }}
  you are too old 
{{#elseif user.type <= 2}}
  you are too young
{{#else}}
  Welcome to xx
{{/if}}
```

{{#template content /}}

> 在regular中，`{{#}}`开头的被视为模板指令的开始，就如<TagName>之于html, `{{#}}`在模板JST中被视为是开标记



