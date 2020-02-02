import express, {Express} from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import { buildSchema, AuthChecker } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import GrapheneUserResolver from './resolvers/GrapheneUserResolver';
import { createConnection, Connection, EntitySchema, ConnectionOptions } from 'typeorm';
import { join } from "path";
import GrapheneUser from './models/GrapheneUser';
import { readFile } from 'fs';
import jwt from "express-jwt";
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

const www = join(__dirname, "..", "..", "ui", "www");
const indexHtml = join(www, "index.html");

export interface GrapheneContext extends ExpressContext
{
    user: {
        id?: string
    }
}

export interface GrapheneOptions 
{
    entities?: EntitySchema<any>[];
    resolvers?: Function[];
    connection?: ConnectionOptions;
    port?: number;
    hostname?: string;
    secret?: string;
}

export class GrapheneServer
{

    private constructor(
        public options: GrapheneOptions,
        public schema: GraphQLSchema,
        public apollo: ApolloServer,
        public express: Express,
        public orm: Connection
    ){}

    static async create(opts?: GrapheneOptions)
    {

        const connection = await createConnection(Object.assign({
            type: "sqlite",
            database: "./db.sqlite3",
            entities: [GrapheneUser, ...(opts?.entities ?? [])],
            synchronize: true
        }, opts?.connection));

        const schema = await buildSchema({
            resolvers: [GrapheneUserResolver, ...(opts?.resolvers ?? [])],
            emitSchemaFile: true,
            authChecker: GrapheneServer.authChecker
        });

        const apollo = new ApolloServer({
            schema,
            validationRules: [depthLimit(7)],
            context: ({ req }) => ({
                req,
                user: (req as any).user ?? {}, // `req.user` comes from `express-jwt`
              } as GrapheneContext),
        });

        const app = express();

        app.use('*', cors()); 
        app.use(compression());
        app.use("/api", jwt({ 
          secret: opts?.secret ?? "Graphene",
          credentialsRequired: false,
        }));
        apollo.applyMiddleware({ app, path: '/graphql' });
        app.use(express.static(www));
        app.use((req, res) => {
            readFile(indexHtml, (err, data) => {
                res.send(data.toString());
            });
        });
        
        return new GrapheneServer(opts ?? {}, schema, apollo, app, connection);
    }

    private static authChecker: AuthChecker<GrapheneContext> = 
    async ({ root, args, context, info }, roles) => 
    {
        const user = await GrapheneUser.findOne(context.user.id);
        if (user) {
            return roles.length === 0 || roles.includes(user.role);
        }
        return false; 
    }

    async listen()
    {
        return new Promise((res) => 
            this.express.listen(
                this.options.port ?? 1234, 
                this.options.hostname ?? "0.0.0.0", 
                res
            )
        );
    }
}