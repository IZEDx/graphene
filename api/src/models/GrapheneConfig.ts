import { Field, ObjectType } from "type-graphql";
import KeyValue from "./KeyValue";

@ObjectType()
export default class GrapheneConfig
{

    @Field(type => [KeyValue])
    inputRenderers: KeyValue[];

    @Field(type => [KeyValue])
    cellRenderers: KeyValue[];

    @Field(type => [String])
    hiddenContentTypes: string[];

    constructor(
        inputRenderers: Record<string, string>,
        cellRenderers: Record<string, string>,
        hiddenContentTypes: string[]
    ) {
        this.inputRenderers = Object.entries(inputRenderers)
            .map(([key, value]) => new KeyValue(key, value));

        this.cellRenderers = Object.entries(cellRenderers)
            .map(([key, value]) => new KeyValue(key, value));

        this.hiddenContentTypes = [...hiddenContentTypes];
    }
}   