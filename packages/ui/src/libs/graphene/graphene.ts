import { GraphQLSchema, buildClientSchema } from "graphql";
import { GrapheneQueryField } from "./queryField";
import { GrapheneType } from "./types/base";
import { GrapheneField } from "./field";
import { GrapheneInputObjectType } from "./types/inputObject";
import { GrapheneAPI } from "../../global/api";
import { GrapheneListType } from "./types/list";
import { GrapheneObjectType } from "./types/object";

export const maxScopes = 5;

export class Graphene
{

    schema: GraphQLSchema;
    isConnected = false;

    queryFields: GrapheneQueryField<GrapheneType<any>>[] = [];
    queryFieldMap: Record<string, GrapheneQueryField<GrapheneType<any>>> = {};

    mutationFields: GrapheneField<GrapheneInputObjectType>[] = [];
    mutationFieldMap: Record<string, GrapheneField<GrapheneInputObjectType>> = {};

    constructor(
        public api: GrapheneAPI,
        public cellRenderers: Record<string, (val: any) => any>, 
        public inputRenderers: Record<string, (props: any) => any>
    )
    {}

    async load()
    {
        this.schema = buildClientSchema(await this.api.query("introspect"));

        const mutationFields = this.schema.getMutationType().getFields();
        this.mutationFields = [];
        for (const [k, f] of Object.entries(mutationFields))
        {
            this.mutationFields.push(await GrapheneField.create(k, f, this));
        }
        this.mutationFieldMap = this.mutationFields.reduce((a, b) => ({...a, [b.name]: b}), {});
        
        const queryFields = this.schema.getQueryType().getFields();
        this.queryFields = [];
        for (const [k, f] of Object.entries(queryFields))
        {
            this.queryFields.push(await GrapheneQueryField.create(k, f, this));
        }
        this.queryFieldMap = this.queryFields.reduce((a, b) => ({...a, [b.name]: b}), {});

        this.isConnected = true;
    }

    getQuery<T extends GrapheneType<any>>(name: string): GrapheneQueryField<T>|undefined
    {
        return this.queryFieldMap[name] as any;
    }

    getMutation<T extends GrapheneInputObjectType>(name: string): GrapheneField<T>|undefined
    {
        return this.mutationFieldMap[name] as any;
    }

    get queryLists(): GrapheneQueryField<GrapheneListType>[]
    {
        return this.queryFields.filter(({type}) => type.getType(GrapheneListType)) as any; 
    }

    get queryObjects(): GrapheneQueryField<GrapheneObjectType>[]
    {
        return this.queryFields.filter(({type}) => type.getType(GrapheneObjectType)) as any; 
    }

}
