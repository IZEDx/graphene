import { Arg, FieldResolver, Query, Resolver, Root, Mutation, Authorized, ResolverInterface } from "type-graphql";
import GrapheneUser from "../models/GrapheneUser";
import { CreateGrapheneUserInput } from "../inputs/CreateGrapheneUserInput";
import { LoginGrapheneUserInput } from "../inputs/LoginGrapheneUserInput";
import { GrapheneContext } from "../server";

@Resolver(of => GrapheneUser)
export default class GrapheneUserResolver implements ResolverInterface<GrapheneUser>
{
    @Query(returns => [GrapheneUser])
    grapheneUsers()
    {
        return GrapheneUser.find();
    }

    @Query(() => GrapheneUser)
    grapheneUser(@Arg("id") id: string) 
    {
        return GrapheneUser.findOne({ where: { id } });
    }
    
    @FieldResolver()
    password(@Root() userData: GrapheneUser) 
    {
        return "***";
    }

    @Authorized("ADMIN")
    @Mutation(() => GrapheneUser)
    async createGrapheneUser(@Arg("data") data: CreateGrapheneUserInput) 
    {
        const user = GrapheneUser.create(data);
        await user.save();
        return user;
    }

    @Mutation(() => GrapheneUser)
    async loginGraphene(@Arg("data") data: LoginGrapheneUserInput, @Root("context") context: GrapheneContext)
    {
        const user = await GrapheneUser.findOne({ where: { name: data.name } });
        if (!user || user.password !== data.password)
        {
            throw new Error("Credentials invalid");
        }
        context.user.id = user.id;
        return user;
    }
} 