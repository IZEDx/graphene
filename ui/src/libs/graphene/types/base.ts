import { GraphQLOutputType, GraphQLInputType } from "graphql";
import { Kind, getKind, kindMap } from "../kinds";
import { Graphene } from "../graphene";
import { GrapheneListType } from "./list";
import { GrapheneObjectType } from "./object";
import { GrapheneScalarType } from "./scalar";
import { GrapheneNonNullType } from "./nonnull";
import { GrapheneUnionType } from "./union";
import { GrapheneInputObjectType } from "./inputObject";
import { GrapheneEnumType } from "./enum";

export abstract class GrapheneType<T extends GraphQLOutputType|GraphQLInputType = GraphQLOutputType>
{

    kind: Kind;
    name: string;

    protected constructor(public _type: T, public graphene: Graphene)
    {
        this.kind = getKind(_type);
        this.name = _type["name"];
    }

    static _instances = {} as Record<string, GrapheneType<any>>;
    static async create(type: GraphQLOutputType|GraphQLInputType, graphene: Graphene): Promise<GrapheneType|undefined>
    {
        await (new Promise(res => setTimeout(res, 0)));

        const kind = getKind(type);

        if (kind === "UNKNOWN") return undefined;

        const c = kindMap[getKind(type)] as typeof GrapheneType;
        const r = await c.create(type, graphene);

        return r;
    }

    abstract toQuery(scope?: number): string;
    abstract renderCell(val: any): any;
    abstract renderEdit(val: any): any;

    isList =    (): this is GrapheneListType    => this.kind === "LIST";
    isObject =  (): this is GrapheneObjectType  => this.kind === "OBJECT";
    isScalar =  (): this is GrapheneScalarType  => this.kind === "SCALAR";
    isNonNull = (): this is GrapheneNonNullType => this.kind === "NONNULL";
    isUnion =   (): this is GrapheneUnionType   => this.kind === "UNION";
    isInputObject =   (): this is GrapheneInputObjectType   => this.kind === "INPUT_OBJECT";
    isEnum =    (): this is GrapheneEnumType        => this.kind === "ENUM";
    isUnknown = (): this is GrapheneType        => this.kind === "UNKNOWN";

    getType<R extends GrapheneType>(type: Function&{create(...args: any[]): Promise<R>}, c = 5): R|undefined
    {
        if (c < 0) return undefined;
        if (this instanceof type) return this as any;
        if (this.isNonNull()) return this.ofType?.getType(type, c - 1);
        if (this.isUnion()) return this.types.map(t => t.getType(type, c - 1)).find(t => t !== undefined);

        return undefined;
    }
}

