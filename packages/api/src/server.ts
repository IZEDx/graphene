import express, {Express} from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import { buildSchema, AuthChecker } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import UserResolver from './resolvers/user/UserResolver';
import { createConnection, Connection, EntitySchema, ConnectionOptions, useContainer } from 'typeorm';
import { join } from "path";
import User from './models/User';
import { readFile } from 'fs';
import jwt from "express-jwt";
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { UserRole } from './models/enums/UserRole';
import cookieParser from "cookie-parser";
import { Container } from "typedi";
import { UserService } from './services/UserService';
import { ColorfulChalkLogger, DEBUG } from "colorful-chalk-logger";
import GrapheneConfig from './models/GrapheneConfig';
import GrapheneConfigResolver from './resolvers/grapheneConfig/GrapheneConfigResolver';

const www = join(__dirname, "..", "..", "ui", "www");
const indexHtml = join(www, "index.html");

useContainer(Container);

export interface GrapheneContext extends ExpressContext
{
    user: {
        id?: string
    }
}

export interface GrapheneOptions 
{
    entities?: EntitySchema<any>[];
    resolvers?: (string | Function)[];
    connection?: ConnectionOptions;
    port?: number;
    hostname?: string;
    secret?: string;
    adminPassword?: string;
    customHead?: string;
    inputRenderers?: Record<string, string>;
    cellRenderers?: Record<string, string>;
    demoMode?: boolean;
    authExpire?: number; // in days
}

export class GrapheneServer
{
    public logger: ColorfulChalkLogger;
    public options: GrapheneOptions;
    public schema: GraphQLSchema;
    public apollo: ApolloServer;
    public express: Express;
    public orm: Connection;

    public clientConfig: GrapheneConfig;

    private constructor(){}

    static async create(opts?: GrapheneOptions)
    {
        const server = new GrapheneServer();
        server.options = opts ?? {};

        Container.set("server", server);
        
        server.logger = new ColorfulChalkLogger('graphene', {
            level: DEBUG,   // the default value is INFO
            date: false,    // the default value is false.
            colorful: true, // the default value is true.
            inline: true
        }, process.argv);

        Container.set("logger", server.logger);

        if (opts?.demoMode)
        {
            server.logger.info("Running in demo mode")
        }

        const connectionConfig = Object.assign({
            type: "sqlite",
            database: "./db.sqlite3",
            entities: [User, ...(opts?.demoMode ? [await import('./models/DemoPage')] : []), ...(opts?.entities ?? [])],
            synchronize: true
        }, opts?.connection);

        server.logger.verbose(`Connecting to ${connectionConfig.database}(${connectionConfig.type})`);
        server.orm = await createConnection(connectionConfig);


        server.logger.verbose("Setting up express");
        server.express = express();
        
        server.express.use('*', cors()); 
        server.express.use(compression());
        server.express.use(cookieParser());

        server.logger.verbose("Setting up jwt");
        server.express.use(jwt({ 
            secret: opts?.secret ?? "Graphene",
            credentialsRequired: false,
            getToken: (req) => {
                if (req.headers.authorization?.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                } else if (req.query?.token) {
                    return req.query.token;
                } else if (req.cookies?.token) {
                    return req.cookies.token;  
                }
                return null;
            }
        }));
 
        server.clientConfig = new GrapheneConfig(opts?.inputRenderers ?? {}, opts?.cellRenderers ?? {})
 
        server.logger.verbose("Setting up graphql");

        const resolvers = [UserResolver, ...(opts?.demoMode ? [await import('./resolvers/demoPage/DemoPageResolver')] : []), GrapheneConfigResolver, ...(opts?.resolvers ?? [])];
        server.schema = await buildSchema({
            resolvers: resolvers as any,
            emitSchemaFile: true,
            authChecker: UserService.AuthChecker,
            container: Container
        });

        server.apollo = new ApolloServer({ 
            schema: server.schema,
            validationRules: [depthLimit(7)],
            context: ({req, res}) => {
                const user = (req as any).user ?? {};
                //server.logger.debug("context user", user);
                return { req, res, user } as GrapheneContext;
            },
        });
        server.apollo.applyMiddleware({ app: server.express, path: '/graphql' });

        server.logger.verbose("Setting up ui");
        server.express.use(express.static(www));
        server.express.use((req, res) => {
            readFile(indexHtml, (err, data) => {
                res.send(data.toString().replace("<!--CUSTOM_HEAD-->", opts?.customHead ?? ""));
            });
        });

        server.logger.verbose("Checking for admin user");
        await this.createAdminUser(opts?.adminPassword);

        return server;
    }


    private static async createAdminUser(overridePw?: string)
    {
        const userService = Container.get(UserService);
        let adminUser = await User.findOne({where: {name: "admin"}});
        if (!adminUser)
        {
            adminUser = await userService.create({name: "admin", role: UserRole.ADMIN, password: "admin"});
        }
        
        if (overridePw)
        {
            userService.update(adminUser, {
                password: overridePw
            });
        }
    }


    async listen()
    {
        const host = this.options.hostname ?? "0.0.0.0";
        const port = this.options.port ?? 1234;

        return new Promise((res) => 
            this.express.listen(port, host, () => {
                    this.logger.info(`Listening on ${host}:${port}`);
                    res();
            })
        );
    }
}