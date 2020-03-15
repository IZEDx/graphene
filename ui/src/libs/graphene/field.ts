import { GrapheneType } from "./types/base";
import { GraphQLOutputType, GraphQLField, GraphQLFieldMap } from "graphql";
import { GrapheneArgument } from "./argument";
import { Graphene, maxScopes } from "./graphene";
import hash from "object-hash";
import { GrapheneListType } from "./types/list";
import { GrapheneObjectType } from "./types/object";
import { GrapheneScalarType } from "./types/scalar";
import { GrapheneNonNullType } from "./types/nonnull";
import { GrapheneUnionType } from "./types/union";
import { GrapheneEnumType } from "./types/enum";

export class GrapheneField<T extends GrapheneType<GraphQLOutputType> = GrapheneType<GraphQLOutputType>>
{
    type: T
    description: string;
    args: GrapheneArgument[] = [];

    protected constructor(public name: string, public _field: GraphQLField<any, any>, public graphene: Graphene)
    {}

    static _instances = {} as Record<string, GrapheneField<any>>;
    static async create<T extends GrapheneField = GrapheneField>
    (name: string, _field: GraphQLField<any, any>, graphene: Graphene, instance?: T): Promise<T>
    {
        
        const key = hash({name, field: JSON.stringify(_field)});
        if (GrapheneField._instances[key]) return GrapheneField._instances[key] as any;
        const field = instance ?? new GrapheneField(name, _field, graphene) as T;
        GrapheneField._instances[key] = field;

        field.description = _field.description;
        field.type = await GrapheneType.create(_field.type as any, graphene) as any;

        for (const a of (_field.args ?? []))
        {
            field.args.push(await GrapheneArgument.create(a, graphene));
        }

        return field;
    }

    isList = (): this is GrapheneField<GrapheneListType> => this.type?.isList();
    isObject = (): this is GrapheneField<GrapheneObjectType> => this.type?.isObject();
    isScalar = (): this is GrapheneField<GrapheneScalarType> => this.type?.isScalar();
    isNonNull = (): this is GrapheneField<GrapheneNonNullType> => this.type?.isNonNull();
    isUnion = (): this is GrapheneField<GrapheneUnionType> => this.type?.isUnion();
    isEnum = (): this is GrapheneField<GrapheneEnumType> => this.type?.isEnum();
    isUnknown = (): this is GrapheneField<any> => this.type?.isUnknown();

    static async fromFieldMap(fields: GraphQLFieldMap<any, any, {
        [key: string]: any;
    }>, graphene: Graphene, c: typeof GrapheneField = GrapheneField)
    {
        const result = [] as GrapheneField<any>[];
        for (const [k, f] of Object.entries(fields))
        {
            result.push(await c.create(k, f, graphene))
        }
        return result;
    }

    toQuery(c = maxScopes): string
    {
        if (c <= 0) return "";
        if (!this.type) {
            console.log("WTF", this);
            return "";
        }
        const query = this.type.toQuery(c - 1);
        return query.includes("GRAPHENE_SKIP_FIELD!!!") ? "" : `${this.name} ${query}`;
    }
}
