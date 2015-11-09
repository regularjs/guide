# filter——过滤器

定义一个过滤器，可以在表达式中使用，一般应用在插值中，行为与angular的filter一致

## 接口说明

__`Component.filter(name, filterFn)`__

  - name 过滤器名如`format`
  - Function filterFn(value, args...) 传入参数如下<br>
    - value 要过滤的值
    - args  template里传入的其它参数
    - this 这里的this指向component组件本身

> 当不传入spec时，filter是一个getter方法，用于获取过滤器定义



__Example__

创建一个简单的日期格式化过滤器

```javascript
// simplest date format
var filter = function(){
  function fix(str){
    str = "" + (str || "");
    return str.length <= 1? "0" + str : str;
  }
  var maps = {
    'yyyy': function(date){return date.getFullYear()},
    'MM': function(date){return fix(date.getMonth() + 1); },
    'dd': function(date){ return fix(date.getDate()) },
    'HH': function(date){ return fix(date.getHours()) },
    'mm': function(date){ return fix(date.getMinutes())}
  }

  var trunk = new RegExp(Object.keys(maps).join('|'),'g');
  return function(value, format){
    format = format || "yyyy-MM-dd HH:mm";
    value = new Date(value);

    return format.replace(trunk, function(capture){
      return maps[capture]? maps[capture](value): "";
    });
  }
}();
Regular.filter("format", filter)

```

然后

```html
<p>{time| format: 'yyyy-MM-dd HH:mm'}</p>

```




