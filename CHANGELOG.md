## 0.5.0 (2025-07-08)

* Upgrade to Alchemy v1.4.0

## 0.4.0 (2023-06-17)

* Use `al-` prefix for custom elements
* Add `Component#loadCustomButtonContent()` method support
* Make `Component#refresh()` keep current connections
* Add `Component#throttledRefresh()` and use it in the `setSetting()` method
* Turn `Component#settings` property into an enforced getter/setter
* Use chimera's stylings for the component config form
* Add a component title & description to the top of the configuration dialog
* Make description & title show up in the `fv-list` element
* Sort nodes in the `fv-list` alphabetically
* Fix a schema clone issue

## 0.3.1 (2022-06-12)

* Fix custom anchors being removed after an update
* Fix component settings breaking serialization

## 0.3.0 (2022-05-31)

* Allow adding categories to components
* Component settings update fixes
* Add client-side component class
* Let client-side components handle fv-node inits

## 0.2.1

* Update to newer Alchemy version
* Add Flow field type

## 0.2.0

* Switch to self-made `Flowview` library instead of `JSPlumb`
* Blocks can have multiple inputs & outputs

## 0.1.0

* Original version using JSPlumb, moved from Elric