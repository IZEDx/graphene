import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class KeyValue
{
    constructor(key: string, value: string)
    {
        this.key = key;
        this.value = value;
    }

    @Field()
    key: string;

    @Field()
    value: string;
}   