import { Arg, Query, Resolver, Mutation, Authorized, Ctx, InputType, Field, FieldResolver, Root, ResolverInterface } from "type-graphql";
import User from "../../models/User";
import { GrapheneContext } from "../../server";
import { Service } from "typedi";
import DemoPage from "../../models/DemoPage";
import { DemoPageService } from "../../services/DemoPageService";
import { RichContent } from "../../models/scalars/RichContent";

@InputType()
export class CreatePageInput {
    @Field()
    title: string;

    @Field(type => RichContent)
    content: string;
}

@InputType()
export class EditPageInput {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field(type => RichContent)
    content: string;
}


@Service()
@Resolver(of => DemoPage)
export default class DemoPageResolver
{
    constructor(
        private readonly pageService: DemoPageService
    ){}

    @Query(returns => [DemoPage])
    demoPages()
    {
        return this.pageService.getAll();
    }

    @Query(() => DemoPage)
    demoPage(@Arg("id") id: string) 
    {
        return this.pageService.getOne(id);
    }

    @Authorized("ADMIN")
    @Mutation(() => DemoPage)
    async createDemoPage(@Arg("data") data: CreatePageInput, @Ctx() context: GrapheneContext) 
    {
        const user = await User.findOne({ where: { id: context.user.id } });
        return this.pageService.create(data, user!);
    }

    @Authorized("ADMIN")
    @Mutation(() => DemoPage)
    async editDemoPage(@Arg("data") data: EditPageInput, @Ctx() context: GrapheneContext) 
    {
        return this.pageService.edit(data);
    }

    @Authorized("ADMIN")
    @Mutation(() => DemoPage)
    async deleteDemoPage(@Arg("id") id: string) 
    {
        return this.pageService.delete(id);
    }
} 