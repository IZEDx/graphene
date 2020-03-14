# view-dashboard



<!-- Auto Generated Below -->


## Events

| Event            | Description | Type                            |
| ---------------- | ----------- | ------------------------------- |
| `pushBreadcrumb` |             | `CustomEvent<[string, string]>` |


## Dependencies

### Depends on

- [util-guard](../../utils)

### Graph
```mermaid
graph TD;
  view-dashboard --> util-guard
  util-guard --> view-login
  view-login --> gel-form
  view-login --> gel-input-text
  style view-dashboard fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
