import { Arg, Query, Resolver, Mutation, Authorized, Ctx } from "type-graphql";
import User from "../../models/User";
import { CreateUserInput } from "./CreateUserInput";
import { EditUserInput } from "./EditUserInput";
import { LoginUserInput } from "./LoginUserInput";
import { GrapheneContext } from "../../server";
import { Service } from "typedi";
import { UserService } from "../../services/UserService";

@Service()
@Resolver(of => User)
export default class UserResolver //implements ResolverInterface<User>
{
    constructor(
        private readonly userService: UserService
    ){}

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
        const user = await User.findOne({ where: { id: data.id } });
        if (!user) throw new Error("User not found: " + data.id);

        return this.userService.update(user, data);
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
    async me(@Ctx() context: GrapheneContext)
    {
        const user = await User.findOne({ where: { id: context.user.id } });
        if (!user) throw new Error("User not found: " + context.user.id);

        return user; 
    }

    @Authorized("USER", "ADMIN")
    @Mutation(() => User)
    async editMe(@Arg("data") data: EditUserInput, @Ctx() context: GrapheneContext) 
    {
        const user = await User.findOne({ where: { id: context.user.id } });

        return this.userService.update(user!, data);
    }

    @Mutation(() => String)
    async login(@Arg("data") data: LoginUserInput, @Ctx() context: GrapheneContext)
    {
        const user = await User.findOne({ where: { name: data.name } });
        if (!user || !await this.userService.checkPassword(user, data.password)) throw new Error("Credentials invalid");

        return this.userService.authorize(user, context, 1);
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