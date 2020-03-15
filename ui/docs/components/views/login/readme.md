# view-login



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type                                               |
| ----------------- | ----------- | -------------------------------------------------- |
| `clearBreadcrumb` |             | `CustomEvent<void>`                                |
| `login`           |             | `CustomEvent<{ name: string; password: string; }>` |
| `pushBreadcrumb`  |             | `CustomEvent<[string, string]>`                    |


## Dependencies

### Used by

 - [util-guard](../../utils)

### Depends on

- [gel-form](../../elements/form)
- [gel-input-text](../../elements/form/inputs)

### Graph
```mermaid
graph TD;
  view-login --> gel-form
  view-login --> gel-input-text
  util-guard --> view-login
  style view-login fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
