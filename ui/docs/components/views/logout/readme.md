# view-logout



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type                            |
| ----------------- | ----------- | ------------------------------- |
| `clearBreadcrumb` |             | `CustomEvent<void>`             |
| `logout`          |             | `CustomEvent<void>`             |
| `pushBreadcrumb`  |             | `CustomEvent<[string, string]>` |


## Dependencies

### Depends on

- [util-guard](../../utils)

### Graph
```mermaid
graph TD;
  view-logout --> util-guard
  util-guard --> view-login
  view-login --> gel-form
  view-login --> gel-input-text
  style view-logout fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
