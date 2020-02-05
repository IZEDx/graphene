import { Arg, FieldResolver, Query, Resolver, Root, Mutation, Authorized, ResolverInterface } from "type-graphql";
import User from "../models/User";
import { CreateUserInput } from "../inputs/CreateUserInput";
import { EditUserInput } from "../inputs/EditUserInput";
import { LoginUserInput } from "../inputs/LoginUserInput";
import { GrapheneContext } from "../server";

@Resolver(of => User)
export default class UserResolver implements ResolverInterface<User>
{
    @Authorized("USER", "ADMIN")
    @Query(returns => [User])
    users()
    {
        return User.find();
    }

    @Authorized("USER", "ADMIN")
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
        return user.save();
    }

    @Authorized("ADMIN")
    @Mutation(() => User)
    async editUser(@Arg("data") data: EditUserInput) 
    {
        const user = await User.findOne({ where: { id: data.id } });
        if (!user) throw new Error("User not found: " + data.id);
        data.id = user.id;
        if (data.password === "***") data.password = user.password;
        Object.assign(user, data);
        return user.save();
    }

    @Authorized("ADMIN")
    @Mutation(() => User)
    async deleteUser(@Arg("id") id: string) 
    {
        const user = await User.findOne({ where: { id } });
        if (!user) throw new Error("User not found: " + id);

        return user.remove();
    }

    @Authorized("USER", "ADMIN")
    @Query(() => User)
    async me(@Root("context") context: GrapheneContext)
    {
        const user = User.findOne({ where: { id: context.user.id } });
        if (!user) throw new Error("User not found: " + context.user.id);
        return user;
    }

    @Authorized("USER", "ADMIN")
    @Mutation(() => User)
    async editMe(@Arg("data") data: EditUserInput, @Root("context") context: GrapheneContext) 
    {
        const user = await User.findOne({ where: { id: context.user.id } });

        data.id = user!.id;
        if (data.password === "***") data.password = user!.password;
        Object.assign(user, data);
        return user!.save();
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

    @Authorized("USER", "ADMIN")
    @Mutation(() => User)
    async logout(@Root("context") context: GrapheneContext)
    {
        const user = await User.findOne({ where: { id: context.user.id } });
        context.user.id = undefined;
        return user!;
    }
} 