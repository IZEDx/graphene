# graphene-ui



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type     | Default     |
| ---------- | ----------- | ----------- | -------- | ----------- |
| `endPoint` | `end-point` |             | `string` | `undefined` |
| `token`    | `token`     |             | `string` | `undefined` |


## Dependencies

### Depends on

- [util-route-listener](../utils)
- [graphene-nav](../graphene-nav)
- [gel-breadcrumbs](../elements/breadcrumbs)
- stencil-router
- stencil-route-switch
- stencil-route
- [notification-provider](../providers)
- [graphene-provider](../providers)
- [breadcrumb-provider](../providers)

### Graph
```mermaid
graph TD;
  graphene-ui --> util-route-listener
  graphene-ui --> graphene-nav
  graphene-ui --> gel-breadcrumbs
  graphene-ui --> stencil-router
  graphene-ui --> stencil-route-switch
  graphene-ui --> stencil-route
  graphene-ui --> notification-provider
  graphene-ui --> graphene-provider
  graphene-ui --> breadcrumb-provider
  graphene-nav --> gel-menu
  gel-menu --> stencil-route-link
  gel-breadcrumbs --> stencil-route-link
  style graphene-ui fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
