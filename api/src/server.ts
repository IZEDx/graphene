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
import { colorConsole, Tracer } from "tracer";
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
    customEndpoint?: string;
    inputRenderers?: Record<string, string>;
    cellRenderers?: Record<string, string>;
    hiddenContentTypes?: string[];
    demoMode?: boolean;
    authExpire?: number; // in days
}

export class GrapheneServer
{
    public logger: Tracer.Logger;
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
        
        server.logger = colorConsole({
            level: "debug",
            format: [
                "{{timestamp}} graphene <{{title}}> {{message}}",
                {
                    error: '{{timestamp}} graphene <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}',
                    warn: '{{timestamp}} graphene <{{title}}> {{message}} (in {{file}}:{{line}})'
                }
            ]
        });

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

        server.logger.info(`Connecting to ${connectionConfig.database}(${connectionConfig.type})`);
        server.orm = await createConnection(connectionConfig);


        server.logger.info("Setting up express");
        server.express = express();
        
        server.express.use('*', cors()); 
        server.express.use(compression());
        server.express.use(cookieParser());

        server.logger.info("Setting up jwt");
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
 
        server.clientConfig = new GrapheneConfig(
            opts?.inputRenderers ?? {}, 
            opts?.cellRenderers ?? {},
            ["GrapheneConfig", ...(opts?.hiddenContentTypes ?? [])]
        )
 
        server.logger.info("Setting up graphql");

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

        server.logger.info("Setting up admin ui");
        server.express.use("/admin", express.static(www));
        server.express.use("/admin", (req, res) => {
            readFile(indexHtml, (err, data) => {
                res.send(data.toString()
                    .replace("<!--CUSTOM_HEAD-->", opts?.customHead ?? "")
                    .replace("<!--ENDPOINT-->", opts?.customEndpoint ?? "/graphql")
                );
            });
        });
        server.apollo.applyMiddleware({ app: server.express, path: '/graphql' });

        server.logger.info("Checking for admin user");
        await server.createAdminUser(opts?.adminPassword);

        return server;
    }


    private async createAdminUser(overridePw?: string)
    {
        const userService = Container.get(UserService);
        let adminUser = await User.findOne({where: {name: "admin"}});
        if (!adminUser)
        {
            adminUser = await userService.create({name: "admin", role: UserRole.ADMIN, password: "admin"});
            this.logger.info("Default admin user was created with password: \"admin\"");
            this.logger.info("Please change your password after first login");
        }
        
        if (overridePw)
        {
            adminUser = await userService.update(adminUser, {
                password: overridePw
            });
            this.logger.info("Admin password was overriden");
        }

        return adminUser;
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