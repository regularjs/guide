#API Reference

This page aims at helping you to find all the api in this guide

# Static Method

> Warn: some methods only belong to `Regular`, but some are available to all `Component`(Regular and its SubClass).

1. [Component.extend](../core/class.html#extend):       creating A Component
7. [new Component](../core/class.html#instance):        Initialize A Component
1. [Component.implement](../core/class.html#implement): extend Component.prototype
2. [Component.directive](../core/directive.md):          define a directive for Component and its SubComponent
3. [Component.filter](../core/filter.md):             define a filter for Component and its SubComponent
4. [Component.event](../core/event.md):               define a custom event for Component and its SubComponent
5. [Component.animation](../core/animation.md):             define a custom animation
6. [Component.use](../core/use.md):                   use a plugin
7. [Regular.expression](../syntax/expression.html#expression):  create a Expression form String at runtime



# Instance Method

> `$`-prefixed method means that you should not rewrite it.

1. [component.$watch](../core/binding.html#watch)         create a watcher
2. [component.$unwatch](../core/binding.html#unwatch):    destroy a watcher
3. [component.$update](../core/binding.html#update):      update data and enter the digest phase
3. [component.$get](../core/binding.html#get):            update data and enter the digest phase
4. [component.$bind](../core/binding.html#bind)           create binding between two component
5. [component.$on](../core/message.html#on)               Listens on events of a given type
6. [component.$off](../core/message.html#off)             remove Listener with given type
7. [component.$emit](../core/message.html#emit)           trigger Listener
8. [component.$inject](../getting-start/quirk-example.html#$inject) $inject component to the specified place


# Builtin

1. [directive](../core/directive.html#builtin)

# Regular's Other Useful API

> comming soon


## Regular.dom


## Regular.util




## Regular.config

some global config.
