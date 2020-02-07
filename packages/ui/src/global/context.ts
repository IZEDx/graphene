import { Entanglement, qt } from "stencil-quantum";
import { GrapheneAPI } from "./api";
import { Graphene, GrapheneObjectType, GrapheneQueryField, GrapheneListType } from "../libs/graphene";

export const graphene = new Entanglement({
    api: qt<GrapheneAPI>(),
    graphene: qt<Graphene>(),
    connected: qt<boolean>({default: false}),
    authorized: qt<boolean>({default: false})
});

export const nav = new Entanglement({
    isExpanded: qt<boolean>({default: false})
})

export const content = new Entanglement({
    definition: qt<GrapheneQueryField<GrapheneObjectType>>(),
    listDef: qt<GrapheneQueryField<GrapheneListType>|undefined>(),
    canCreate: qt<boolean>({default: false}),
    canEdit: qt<boolean>({default: false}),
    canDelete: qt<boolean>({default: false}),
    isList: qt<boolean>({default: false})
})
