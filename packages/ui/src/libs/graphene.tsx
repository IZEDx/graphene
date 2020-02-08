import { GrapheneAPI } from "../global/api";
import { 
    GraphQLSchema, buildClientSchema, GraphQLField, GraphQLList, 
    GraphQLOutputType, GraphQLObjectType, GraphQLFieldMap, GraphQLScalarType, 
    GraphQLArgument, GraphQLNonNull, GraphQLUnionType, GraphQLInputObjectType, 
    GraphQLEnumType, GraphQLEnumValue, GraphQLInputType 
} from "graphql";
import hash from "object-hash";
import { h } from "@stencil/core";
import { pascalCase } from "change-case";

const log = (..._args: any[]) => {}//console.log("[Graphene]", ..._args);

const maxScopes = 5;
const caching = false;

export type Kind = "LIST"|"OBJECT"|"INPUT_OBJECT"|"SCALAR"|"NONNULL"|"UNION"|"UNKNOWN"|"ENUM"; 

export class Graphene
{
    schema: GraphQLSchema;
    isConnected = false;

    queryFields: GrapheneQueryField<GrapheneType<any>>[] = [];
    queryFieldMap: Record<string, GrapheneQueryField<GrapheneType<any>>> = {};

    mutationFields: GrapheneField<GrapheneInputObjectType>[] = [];
    mutationFieldMap: Record<string, GrapheneField<GrapheneInputObjectType>> = {};

    constructor(public api: GrapheneAPI)
    {}

    async load()
    {
        log("Loading");
        this.schema = buildClientSchema(await this.api.query("introspect"));

        log("Analyzing mutation fields");
        const mutationFields = this.schema.getMutationType().getFields();
        this.mutationFields = [];
        for (const [k, f] of Object.entries(mutationFields))
        {
            this.mutationFields.push(await GrapheneField.create(k, f));
        }
        this.mutationFieldMap = this.mutationFields.reduce((a, b) => ({...a, [b.name]: b}), {});
        
        log("Analyzing query fields");
        const queryFields = this.schema.getQueryType().getFields();
        this.queryFields = [];
        for (const [k, f] of Object.entries(queryFields))
        {
            this.queryFields.push(await GrapheneQueryField.create(k, f, this));
        }
        this.queryFieldMap = this.queryFields.reduce((a, b) => ({...a, [b.name]: b}), {});


        log("Done")

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

// #region GrapheneField

export class GrapheneField<T extends GrapheneType<GraphQLOutputType> = GrapheneType<GraphQLOutputType>>
{
    type: T
    description: string;
    args: GrapheneArgument[] = [];

    protected constructor(public name: string, public _field: GraphQLField<any, any>)
    {}

    static _instances = {} as Record<string, GrapheneField<any>>;
    static async create<T extends GrapheneField = GrapheneField>
    (name: string, _field: GraphQLField<any, any>, instance?: T): Promise<T>
    {
        
        const key = hash({name, field: JSON.stringify(_field)});
        if (GrapheneField._instances[key]) return GrapheneField._instances[key] as any;
        const field = instance ?? new GrapheneField(name, _field) as T;
        GrapheneField._instances[key] = field;

        log("Creating Field", name);
        field.description = _field.description;
        log("Analyzing type of Field", name)
        field.type = await GrapheneType.create(_field.type as any) as any;

        log("Analyzing args of Field", name, _field.args);
        for (const a of (_field.args ?? []))
        {
            field.args.push(await GrapheneArgument.create(a));
        }

        log(name, "created");
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
    }>,c: typeof GrapheneField = GrapheneField)
    {
        log("Creating Fields from fieldMap", fields);
        const result = [] as GrapheneField<any>[];
        for (const [k, f] of Object.entries(fields))
        {
            result.push(await c.create(k, f))
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

export class GrapheneQueryField<T extends GrapheneType<GraphQLOutputType> = GrapheneType<GraphQLOutputType>> extends GrapheneField<T>
{
    graphene: Graphene;
    editMutation?: GrapheneField<GrapheneInputObjectType>;
    createMutation?: GrapheneField<GrapheneInputObjectType>;
    deleteMutation?: GrapheneField<GrapheneInputObjectType>;

    static async create<T extends GrapheneField>(name: string, _field: GraphQLField<any, any>, graphene?: any): Promise<T>
    {
        const result = await super.create<GrapheneQueryField>(name, _field, new GrapheneQueryField(name, _field) as any);
        result.graphene = graphene;

        const objectName = pascalCase(result.asObject().name);
        log("Analyzing mutations of QueryField", objectName);
        console.log("edit"+objectName, result.graphene.mutationFieldMap);
        result.editMutation = result.graphene.getMutation("edit"+objectName);
        result.createMutation = result.graphene.getMutation("create"+objectName);
        result.deleteMutation = result.graphene.getMutation("delete"+objectName);

        return result as any;
    }

    async request<T = any>(args?: Record<string, string|number>)
    {
        const fields = this.type.getType(GrapheneObjectType)?.fieldMap;
        const argStr = args && fields && Object.entries(args).length > 0 ? `(${Object.entries(args).map(([k, v]) => 
        {
            const field = fields[k];
            console.log(k, field, fields);

            const quoted = typeof v === "string" || field.name === "String"
            return  `${k}: ` + (quoted ? `"${v}"` : v);
        }).join(", ")})` : "";
        
        const query = `{
            ${this.name}${argStr} ${this.type.toQuery()}
        }`;
        
        console.log(query);
        return this.graphene.api.client.request<T>(query);
    }

    asList(): GrapheneQueryField<GrapheneListType>
    {
        const list = this.graphene.queryFieldMap[this.name + "s"];
        if (list) return list as any;
        return this as any;
    }

    asObject(): GrapheneQueryField<GrapheneObjectType>
    {
        if (!this.name.endsWith("s")) return this as any;
        const obj = this.graphene.queryFieldMap[this.name.slice(0, this.name.length - 1)];
        if (obj) return obj as any;
        return this as any;
    }

    async edit<R = T>(data: any)
    {
        if (!this.editMutation) return;

        const args = this.editMutation.args;
        console.log("edit args", args);
        const arg = args.find(arg => arg.type.getType(GrapheneInputObjectType));
        const dataType = arg.type.getType(GrapheneInputObjectType);

        const query = `mutation {
            ${this.editMutation.name}(${arg.name}: ${dataType.toArgument(data)}) ${this.type.toQuery()}
        }`;
        
        console.log(query);
        return this.graphene.api.client.request<R>(query);
    }

    async create(data: any)
    {
        if (!this.createMutation) return;

        const args = this.createMutation.args;
        console.log("create args", args);
        const arg = args.find(arg => arg.type.getType(GrapheneInputObjectType));
        const dataType = arg.type.getType(GrapheneInputObjectType);

        const query = `mutation {
            ${this.createMutation.name}(${arg.name}: ${dataType.toArgument(data)}) ${this.type.toQuery()}
        }`;
        
        console.log(query);
        return this.graphene.api.client.request<T>(query);
    }

    //TODO: Delete
}

// #endregion

// #region GrapheneType

export abstract class GrapheneType<T extends GraphQLOutputType|GraphQLInputType = GraphQLOutputType>
{
    kind: Kind;
    name: string;

    protected constructor(public _type: T)
    {
        this.kind = getKind(_type);
        this.name = _type["name"];
    }

    static _instances = {} as Record<string, GrapheneType<any>>;
    static async create(type: GraphQLOutputType|GraphQLInputType): Promise<GrapheneType|undefined>
    {
        await (new Promise(res => setTimeout(res, 0)));

        const key = caching ? hash({type: JSON.stringify(type)}) : "";

        if (caching && type["name"] && GrapheneType._instances[key])
        {
            return GrapheneType._instances[key] as any;
        }

        const name = type["name"];
        log("Getting Type", name, type);

        const kind = getKind(type);

        log("Creating Type", name, kind, type);
        if (kind === "UNKNOWN") return undefined;

        const c = kindMap[getKind(type)] as typeof GrapheneType;
        const r = await c.create(type);
        if (caching && type["name"]) GrapheneType._instances[key] = r;

        log("Created Type", name, r);
        return r;
    }

    abstract toQuery(scope?: number): string;
    abstract renderCell(val: any): string;
    abstract renderEdit(val: any): string;

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

export class GrapheneListType<T extends GrapheneType = GrapheneType> extends GrapheneType<GraphQLOutputType>
{
    ofType: T;

    static async create<T extends GrapheneType = GrapheneType>(type: GraphQLOutputType)
    {
        const o = new GrapheneListType<T>(type as any);
        o.ofType = await GrapheneType.create(type["ofType"]) as any;
        return o;
    }

    toQuery(c = maxScopes)
    {
        return this.ofType.toQuery(c);
    }

    renderCell(val: any)
    {
        return "[ " + val
                .map(v => this.ofType.renderCell(v))
                .join(", ") + " ]";
    }

    renderEdit(val: any)
    {
        return `Edit List(${this.ofType.renderEdit(val)})`;
    }
}

export class GrapheneObjectType extends GrapheneType<GraphQLObjectType>
{
    fields: GrapheneField<GrapheneType<GraphQLOutputType>>[]
    fieldMap: Record<string, GrapheneField<GrapheneType<GraphQLOutputType>>>

    static async create(type: GraphQLObjectType)
    {
        const o = new GrapheneObjectType(type);
        o.fields = await GrapheneField.fromFieldMap(type.getFields());
        o.fieldMap = o.fields.reduce((a, b) => ({...a, [b.name]: b}), {});
        return o;
    }

    toQuery(c = maxScopes)
    {
        const query = this.fields.map(f => f.toQuery(c)).join(" ");
        return query.trim().length === 0 
            ? "GRAPHENE_SKIP_FIELD!!!" 
            : `{ ${query} }\n`;
    }

    renderCell(val: any)
    {
        return "{ " + this.fields
                .map(f => f.name + ": " + f.type.renderCell(val[f.name]))
                .join(", ") + " }";
    }

    renderEdit(_val: any)
    {
        return `Edit Object(${this.name})`;
    }
}

export type GrapheneScalarTypeNames = "DateTime"|"Boolean"|"ID"|"String";
export class GrapheneScalarType extends GrapheneType<GraphQLScalarType>
{
    static async create(type: GraphQLScalarType)
    {
        return new GrapheneScalarType(type, type.name as any);
    }

    protected constructor(private type: GraphQLScalarType, public name: GrapheneScalarTypeNames)
    { super(type); }

    toQuery()
    {
        return "";
    }

    renderCell(val: any)
    {
        switch(this.name)
        {
            case "DateTime": return new Date(val).toLocaleString();
            case "Boolean": return ""+val;
            case "ID": return ""+val;
            case "String": return ""+val;
            default: return ""+val;
        }
    }

    renderEdit(props: any)
    {
        switch (this.type.name)
        {
            case "DateTime": return <gel-input-text {...props} key={props.key}></gel-input-text>;
            case "Boolean": return <gel-input-switch {...props} key={props.key}></gel-input-switch>;
            case "ID": return <gel-input-text {...props} key={props.key}></gel-input-text>;
            case "Password": return <gel-input-text {...props} key={props.key} type="password" autoComplete="new-password"></gel-input-text>;
            case "String": return <gel-input-text {...props} key={props.key}></gel-input-text>;
            default: return <gel-input-text {...props} key={props.key}></gel-input-text>;
        }
    }
}

export class GrapheneNonNullType<T extends GrapheneType = GrapheneType> extends GrapheneType<GraphQLOutputType>
{
    ofType: T;
    
    static async create(type: GraphQLNonNull<any>)
    {
        const o = new GrapheneNonNullType(type);
        o.ofType = await GrapheneType.create(type.ofType) as any;
        return o;
    } 

    toQuery(c = maxScopes)
    {
        return this.ofType?.toQuery(c) ?? "";
    }

    renderCell(val: any)
    {
        return this.ofType?.renderCell(val) ?? "";
    }

    renderEdit(val: any)
    {
        return this.ofType.renderEdit(val);
    }
}

export class GrapheneUnionType extends GrapheneType<GraphQLUnionType>
{
    types: GrapheneObjectType[] = [];
    
    static async create(type: GraphQLUnionType)
    {
        const o = new GrapheneUnionType(type);
        for (const t of type.getTypes())
        {
            o.types.push(await GrapheneType.create(t) as any)
        }

        return o;
    } 

    toQuery(c = maxScopes)
    {
        console.log("toQuery Union", this);
        const query = this.types
            .map(type => ([type.name, type.toQuery(c)]))
            .filter(([_, query]) => {
                return query && query.trim().length > 2 && query.slice(1, query.length - 2).trim().length > 0
            })
            .map(([name, query]) => `... on ${name} ${query}` ).join(" ");
        return query ? "{ " + query + " }" : "GRAPHENE_SKIP_FIELD!!!";
    }

    renderCell(val: any)
    {
        return this.types[0]?.renderCell(val) ?? "null";
    }

    renderEdit(val: any)
    {
        return `Edit Union(${this.types.map(t => t.renderEdit(val)).join("|")})`;
    }
}

export class GrapheneInputObjectType extends GrapheneType
{
    fields: GrapheneField<GrapheneInputObjectType>[] = [];
    fieldMap: Record<string, GrapheneField<GrapheneInputObjectType>>;
    
    static async create(type: GraphQLInputType)
    {
        const o = new GrapheneInputObjectType(type as any);
        o.fields = await GrapheneField.fromFieldMap(type["getFields"]() as any);
        o.fieldMap = o.fields.reduce((a, b) => ({...a, [b.name]: b}), {});
        return o;
    } 

    toQuery()
    {
        return "";
    }

    toArgument(data: any)
    {

        const values = Object.entries(data)
            .filter(([k]) => this.fieldMap[k] !== undefined)
            .map(([k, v]) => {
                const field = this.fieldMap[k];
                console.log("lol field", field, field.isEnum());
                let isString = !field.type.getType(GrapheneEnumType) && typeof field !== "number";
                return `${k}: ${isString ? `"${v}"` : v}`;
            });

        return `{ ${values.join(", ")} }`
    }

    renderCell(_val: any)
    {
        return "";
    }

    renderEdit(_val: any)
    {
        return "";
    }
}

export class GrapheneEnumType extends GrapheneType<GraphQLEnumType>
{
    values: GraphQLEnumValue[];

    static async create(type: GraphQLEnumType)
    {
        const o = new GrapheneEnumType(type as any);
        o.values = type.getValues();
        return o;
    } 

    toQuery(_c = maxScopes)
    {
        return "";
    }

    renderCell(_val: any)
    {
        return "" + (this.values.find(v => v.value === _val)?.name ?? _val);
    }

    renderEdit(props: any)
    {
        return <gel-input-select {...props}></gel-input-select>
    }
}

// #endregion


export class GrapheneArgument<
    T extends GrapheneType<GraphQLOutputType> = GrapheneType<GraphQLOutputType>
>
{
    name: string;
    type: T;
    description: string;
    defaultValue: any;

    private constructor(public _arg: GraphQLArgument)
    {
        this.name = _arg.name;
        this.description = _arg.description;
        this.defaultValue = _arg.defaultValue;
    }

    static async create(arg: GraphQLArgument)
    {
        const result = new GrapheneArgument(arg);
        result.type = await GrapheneType.create(arg.type);
        return result;
    }

}

export const kindMap = {
    LIST: GrapheneListType,
    OBJECT: GrapheneObjectType,
    SCALAR: GrapheneScalarType,
    NONNULL: GrapheneNonNullType,
    UNION: GrapheneUnionType,
    INPUT_OBJECT: GrapheneInputObjectType,
    ENUM: GrapheneEnumType,
    UNKNOWN: GrapheneType
}

function getKind(type: GraphQLOutputType|GraphQLInputType): Kind
{
    if (type instanceof GraphQLList) return "LIST";
    if (type instanceof GraphQLObjectType) return "OBJECT";
    if (type instanceof GraphQLScalarType) return "SCALAR";
    if (type instanceof GraphQLNonNull) return "NONNULL";
    if (type instanceof GraphQLUnionType) return "UNION";
    if (type instanceof GraphQLInputObjectType) return "INPUT_OBJECT";
    if (type instanceof GraphQLEnumType) return "ENUM";

    return "UNKNOWN";
}