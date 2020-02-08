import { Arg, Query, Resolver, Mutation, Authorized, Ctx, InputType, Field } from "type-graphql";
import User from "../../models/User";
import { GrapheneContext } from "../../server";
import { Service } from "typedi";
import DemoPage from "../../models/DemoPage";


@InputType()
export class CreatePageInput {
    @Field()
    title: string;
}

@InputType()
export class EditPageInput {
    @Field()
    id: string;

    @Field()
    title: string;
}


@Service()
@Resolver(of => DemoPage)
export default class DemoPageResolver //implements ResolverInterface<User>
{
    @Query(returns => [DemoPage])
    demoPages()
    {
        return DemoPage.find();
    }

    @Query(() => DemoPage)
    demoPage(@Arg("id") id: string) 
    {
        return DemoPage.findOne({ where: { id } });
    }

    @Authorized("ADMIN")
    @Mutation(() => DemoPage)
    async createDemoPage(@Arg("data") data: CreatePageInput, @Ctx() context: GrapheneContext) 
    {
        const user = await User.findOne({ where: { id: context.user.id } });
        const page = DemoPage.create({
            ...data,
            author: user
        });

        return page.save();
    }

    @Authorized("ADMIN")
    @Mutation(() => DemoPage)
    async editDemoPage(@Arg("data") data: EditPageInput, @Ctx() context: GrapheneContext) 
    {
        const page = await DemoPage.findOne({ where: { id: data.id } });
        if (!page) throw new Error("Page not found: " + data.id);

        Object.assign(page, {
            ...data, id: page.id
        });

        return page.save();
    }

    @Authorized("ADMIN")
    @Mutation(() => DemoPage)
    async deleteDemoPage(@Arg("id") id: string) 
    {
        const page = await DemoPage.findOne({ where: { id: id } });
        if (!page) throw new Error("Page not found: " + id);

        return page.remove();
    }
} 