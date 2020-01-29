import { Entanglement, qt } from "stencil-quantum";
import { GrapheneAPI } from "./api";
import { Graphene } from "../libs/graphene";

export const graphene = new Entanglement({
    api: qt<GrapheneAPI>(),
    graphene: qt<Graphene>(),
    connected: qt<boolean>({default: false})
});

export const nav = new Entanglement({
    isExpanded: qt<boolean>({default: false})
})