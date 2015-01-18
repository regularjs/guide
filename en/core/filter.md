# filter

Filters are generally used in interpolation

## API

__`Component.filter(name, filterFn)`__

  - name : filter name
  - Function filterFn(value, args...)
    - value: the value that is passed from the template
    - args:  other params for the function




__Example__

date-format filter

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

then

```html
<p>{time| format: 'yyyy-MM-dd HH:mm'}</p>

```



## Builtin  Filter

todo...
