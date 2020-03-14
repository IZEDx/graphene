# view-content



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type           | Default     |
| ---------- | ----------- | ----------- | -------------- | ----------- |
| `isCreate` | `is-create` |             | `boolean`      | `undefined` |
| `isDelete` | `is-delete` |             | `boolean`      | `undefined` |
| `isEdit`   | `is-edit`   |             | `boolean`      | `undefined` |
| `match`    | --          |             | `MatchResults` | `undefined` |


## Events

| Event             | Description | Type                            |
| ----------------- | ----------- | ------------------------------- |
| `clearBreadcrumb` |             | `CustomEvent<void>`             |
| `pushBreadcrumb`  |             | `CustomEvent<[string, string]>` |


## Dependencies

### Depends on

- [util-guard](../../utils)
- [content-create](.)
- [content-delete](.)
- [content-edit](.)
- [content-list](.)

### Graph
```mermaid
graph TD;
  view-content --> util-guard
  view-content --> content-create
  view-content --> content-delete
  view-content --> content-edit
  view-content --> content-list
  util-guard --> view-login
  view-login --> gel-form
  view-login --> gel-input-text
  content-create --> stencil-route-link
  content-create --> gel-form
  content-edit --> stencil-route-link
  content-edit --> gel-form
  content-list --> gel-table
  style view-content fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
