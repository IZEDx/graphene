import { Service, Inject } from "typedi";
import { GrapheneServer, GrapheneContext } from "../server";
import User from "../models/User";
import { EditUserInput } from "../resolvers/user/EditUserInput";
import { CreateUserInput } from "../resolvers/user/CreateUserInput";
import { compare, hash } from "../libs/bcrypt";
import { passwordMask } from "../models/scalars/Password";
import jwt from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { ColorfulChalkLogger } from "colorful-chalk-logger";


@Service()
export class UserService
{

    @Inject("server") server: GrapheneServer;
    @Inject("logger") logger: ColorfulChalkLogger;

    static AuthChecker: AuthChecker<GrapheneContext> = 
    async ({ root, args, context, info }, roles) => 
    {
        if (!context.user.id) return false;

        const user = await User.findOne(context.user.id);
        console.log(user, roles);
        if (user) {
            return roles.length === 0 || roles.includes(user.role);
        }
        return false; 
    }

    authorize(user: User, ctx: GrapheneContext, expiresInDays = 1) 
    {
        const token = jwt.sign({ id: user.id }, this.server.options.secret ?? "Graphene", {
            expiresIn: expiresInDays + "d",
        }) as string;

        ctx.res.cookie('token', token, {
            path: "/",
            expires: new Date(Date.now() + (expiresInDays * 1000 * 60 * 60 * 24)),
            secure: false, // set to true if your using https
            httpOnly: true,
        });

        return token;
    };

    checkPassword(user: User, password: string)
    {
        return compare(password, user.password);
    }

    async create(data: CreateUserInput)
    {
        Object.assign(data, {
            password: await hash(data.password)
        });

        return User.create(data).save();
    }

    async update(user: User, data: Partial<EditUserInput>)
    {
        Object.assign(user, data, {
            password: !data.password || data.password === passwordMask ? user.password : await hash(data.password),
            id: user.id
        });
        
        return user.save();
    }
}