import express, {Express} from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import UserResolver from './resolvers/UserResolver';
import { createConnection, Connection, EntitySchema } from 'typeorm';
import { join } from "path";
import User from './models/User';
import { readFile } from 'fs';

const www = join(__dirname, "..", "node_modules", "graphene-ui", "www");
const indexHtml = join(www, "index.html");

export interface GrapheneOptions 
{
    entities?: EntitySchema<any>[];
    resolvers?: Function[];
}

export class GrapheneServer
{

    private constructor(
        public schema: GraphQLSchema,
        public apollo: ApolloServer,
        public express: Express,
        public orm: Connection
    ){}

    static async create(opts?: GrapheneOptions)
    {

        const connection = await createConnection({
            type: "sqlite",
            database: "./db.sqlite3",
            entities: [User, ...(opts?.entities ?? [])],
            synchronize: true
        });

        const schema = await buildSchema({
            resolvers: [UserResolver, ...(opts?.resolvers ?? [])],
            emitSchemaFile: true,
        });

        const apollo = new ApolloServer({
            schema,
            validationRules: [depthLimit(7)],
        });

        const app = express();

        app.use('*', cors()); 
        app.use(compression());
        apollo.applyMiddleware({ app, path: '/api' });
        app.use(express.static(www));
        app.use((req, res) => {
            readFile(indexHtml, (err, data) => {
                res.send(data.toString());
            });
        });
        
        return new GrapheneServer(schema, apollo, app, connection);
    }

    async listen(port = 1234, hostname = "0.0.0.0")
    {
        return new Promise((res) => this.express.listen(port, hostname, res));
    }
}