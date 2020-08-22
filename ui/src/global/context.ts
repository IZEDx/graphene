import { Entanglement, qt } from "stencil-quantum";
import { GrapheneAPI } from "./api";
import { Graphene, GrapheneObjectType, GrapheneQueryField, GrapheneListType } from "../libs/graphene";
import { Breadcrumbs } from "../components/elements/breadcrumbs/model";

export const graphene = new Entanglement({
    api: qt<GrapheneAPI>(),
    baseUrl: qt<string>(),
    graphene: qt<Graphene>(),
    connected: qt<boolean>({default: false, mutable: true}),
    apiDown: qt<boolean>({default: false}),
    isAuthorized: qt<boolean>({default: false}),
    token: qt<string|undefined>()
});

export const nav = new Entanglement({
    isExpanded: qt<boolean>({default: false, mutable: true})
})

export const content = new Entanglement({
    definition: qt<GrapheneQueryField<GrapheneObjectType>>(),
    listDef: qt<GrapheneQueryField<GrapheneListType>|undefined>(),
    canCreate: qt<boolean>({default: false}),
    canEdit: qt<boolean>({default: false}),
    canDelete: qt<boolean>({default: false}),
    isList: qt<boolean>({default: false})
})

export const breadcrumb = new Entanglement({
    breadcrumbs: qt<Breadcrumbs>({default: []})
})