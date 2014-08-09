# Why Not React

reactjs have no watch mechanism in it. it works just like full component refresh(like backbone). But meanwhile, thanks for virtual-dom, react can update partially. this feature is awesome during your development, but also bring some genetic defects:

1. without [jsx](). the way to create virtual dom is intolerable.
2. the generated dom need to be stateless in every render since the [virtual-dom's diff algorithm](http://calendar.perfplanet.com/2013/diff/) is always trying minimum-steps. 

  so the mechanism like directive to enhance node's ability is not possible, the ui-event also need based on delegation.




## regular may to rescue. 

actually. when use 


