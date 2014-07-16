# filter

Filter are generally used in the interpolation

## API

__`Component.filter(name, filterFn)`__

  - name : filter name
  - Function filterFn(value, args...) 
    - value: the value is
    - args:  the param passed in template




__Example__

data-format filter

```javascript
  // simplest date format
  Regular.filter("format",function(value, format){
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
  })
```

then 

```html
<p>{{time| format: 'yyyy-MM-dd HH:mm'}}</p>

```



## Builtin  Filter

todo...
