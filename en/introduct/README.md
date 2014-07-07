#Preface


This section will explains why regularjs created.

## angularjs is popular but not fit for every project

There is no forever silver bullet, angular the same. 

1. Angular is obviously framework, its lifecycle is clever but the restrictions is too strong. so integrating it with other frameworks is very difficult. 

2. Steep learning curve when starting further leaning.

3. Logic function based on directive is not flexible enough 

4. FOUC(Flash of unstyled content) is the birth defects of dom-based template.


## reactjs and ractive are shines but also have some defects

reactjs have no watch mechanism in it. it works just like full component refresh(like backbone). But meanwhile, thanks for virtual-dom, react can update partially. this feature is awesome during your implementation on business logic, but also bring some genetic defects.

1. without the depend [jsx](). the way to create virtual dom is intolerable.
  ```javascript
  render: function() {
    return (
      React.DOM.div(null, 
        React.DOM.h3(null, "TODO"),
        TodoList( {items:this.state.items} ),
        React.DOM.form( {onSubmit:this.handleSubmit}, 
          React.DOM.input( {onChange:this.onChange, value:this.state.text} ),
          React.DOM.button(null, 'Add #' + (this.state.items.length + 1))
        )
      )
    );
  }

  ```
2. the generated dom need to be stateless in every render since the virtual-dom's diff a , so the mechanism like directive to enhance node's ability is not possible, the ui-event also are also based on delegate style
3. the diff




## regular to rescue. 



## regularjs's 





