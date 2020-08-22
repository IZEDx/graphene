import { Arg, Query, Resolver, Mutation, Authorized, Ctx } from "type-graphql";
import User from "../../models/User";
import { CreateUserInput } from "./CreateUserInput";
import { EditUserInput } from "./EditUserInput";
import { LoginUserInput } from "./LoginUserInput";
import { GrapheneContext, GrapheneServer } from "../../server";
import { Inject, Service } from "typedi";
import { UserService } from "../../services/UserService";

@Service()
@Resolver(of => User)
export default class UserResolver //implements ResolverInterface<User>
{
    @Inject("server") server: GrapheneServer;
    @Inject("userService") userService: UserService;

    @Authorized("USER", "ADMIN")
    @Query(returns => [User])
    users()
    {
        return this.userService.getAll();
    }

    @Authorized("USER", "ADMIN")
    @Query(() => User)
    user(@Arg("id") id: string) 
    {
        return this.userService.getOne(id);
    }

    @Authorized("ADMIN")
    @Mutation(() => User)
    async createUser(@Arg("data") data: CreateUserInput) 
    {
        return this.userService.create(data);
    }

    @Authorized("ADMIN")
    @Mutation(() => User)
    async editUser(@Arg("data") data: EditUserInput) 
    {
        const user = await this.userService.getOne(data.id);
        if (!user) throw new Error("User not found: " + data.id);

        return this.userService.update(user, data);
    }

    @Authorized("ADMIN")
    @Mutation(() => User)
    async deleteUser(@Arg("id") id: string) 
    {
        const user = await this.userService.getOne(id);
        if (!user) throw new Error("User not found: " + id);

        return user.remove();
    }

    @Authorized("USER", "ADMIN")
    @Query(() => User)
    async me(@Ctx() context: GrapheneContext)
    {
        return this.userService.getOne(context.user.id!); 
    }

    @Authorized("USER", "ADMIN")
    @Mutation(() => User)
    async editMe(@Arg("data") data: EditUserInput, @Ctx() context: GrapheneContext) 
    {
        const user = await this.userService.getOne(context.user.id!);

        return this.userService.update(user!, data);
    }

    @Mutation(() => String)
    async login(@Arg("data") data: LoginUserInput, @Ctx() context: GrapheneContext)
    {
        const user = await this.userService.getOneByName(data.name);
        if (!user || !await this.userService.checkPassword(user, data.password)) throw new Error("Credentials invalid");

        return this.userService.authorize(user, context);
    }

    @Authorized("USER", "ADMIN")
    @Mutation(type => String)
    async logout(@Ctx() context: GrapheneContext)
    {
        context.res.clearCookie('token');
        context.user = {};
        return "";
    }
} 