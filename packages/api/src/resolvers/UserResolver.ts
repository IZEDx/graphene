import { Arg, FieldResolver, Query, Resolver, Root, Mutation, Authorized, ResolverInterface } from "type-graphql";
import User from "../models/User";
import { CreateUserInput } from "../inputs/CreateUserInput";
import { LoginUserInput } from "../inputs/LoginUserInput";
import { GrapheneContext } from "../server";

@Resolver(of => User)
export default class UserResolver implements ResolverInterface<User>
{
    @Query(returns => [User])
    users()
    {
        return User.find();
    }

    @Query(() => User)
    user(@Arg("id") id: string) 
    {
        return User.findOne({ where: { id } });
    }
    
    @FieldResolver()
    password(@Root() userData: User) 
    {
        return "***";
    }

    @Authorized("ADMIN")
    @Mutation(() => User)
    async createUser(@Arg("data") data: CreateUserInput) 
    {
        const user = User.create(data);
        await user.save();
        return user;
    }

    @Mutation(() => User)
    async login(@Arg("data") data: LoginUserInput, @Root("context") context: GrapheneContext)
    {
        const user = await User.findOne({ where: { name: data.name } });
        if (!user || user.password !== data.password)
        {
            throw new Error("Credentials invalid");
        }
        context.user.id = user.id;
        return user;
    }
} 