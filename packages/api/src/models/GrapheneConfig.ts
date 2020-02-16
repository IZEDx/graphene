import { Field, ObjectType } from "type-graphql";
import KeyValue from "./KeyValue";

@ObjectType()
export default class GrapheneConfig
{
    constructor(
        inputRenderers: Record<string, string>,
        cellRenderers: Record<string, string>,
    ) {
        this.inputRenderers = Object.entries(inputRenderers)
            .map(([key, value]) => new KeyValue(key, value));

        this.cellRenderers = Object.entries(cellRenderers)
            .map(([key, value]) => new KeyValue(key, value));
    }

    @Field(type => [KeyValue])
    inputRenderers: KeyValue[];

    @Field(type => [KeyValue])
    cellRenderers: KeyValue[];
}   