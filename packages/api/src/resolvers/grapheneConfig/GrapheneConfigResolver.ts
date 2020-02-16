import { Arg, Query, Resolver, Mutation, Authorized, Ctx } from "type-graphql";
import User from "../../models/User";
import { GrapheneContext, GrapheneServer } from "../../server";
import { Service, Inject } from "typedi";
import { UserService } from "../../services/UserService";
import GrapheneConfig from "../../models/GrapheneConfig";

@Service()
@Resolver(of => GrapheneConfig)
export default class GrapheneConfigResolver //implements ResolverInterface<User>
{
    @Inject("server") server: GrapheneServer;

    @Authorized("USER", "ADMIN")
    @Query(() => GrapheneConfig)
    async grapheneConfig()
    {
        return this.server.clientConfig;
    }
} 