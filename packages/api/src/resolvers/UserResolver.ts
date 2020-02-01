import { Arg, FieldResolver, Query, Resolver, Root, Mutation } from "type-graphql";
import User from "../models/User";
import { CreateUserInput } from "../inputs/CreateUserInput";
import { LoginUserInput } from "../inputs/LoginUserInput";

@Resolver(of => User)
export default class UserResolver
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

    @Mutation(() => User)
    async createUser(@Arg("data") data: CreateUserInput) 
    {
        const user = User.create(data);
        await user.save();
        return user;
    }

    @Mutation(() => User)
    async login(@Arg("data") data: LoginUserInput)
    {
        const user = await User.findOne({ where: { name: data.name } });
        if (!user || user.password !== data.password)
        {
            throw new Error("Credentials invalid");
        }
        
        return user;
    }
}