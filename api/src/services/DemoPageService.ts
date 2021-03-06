import { Service, Inject } from "typedi";
import { GrapheneServer } from "../server";
import DemoPage from "../models/DemoPage";
import { CreatePageInput, EditPageInput } from "../resolvers/demoPage/DemoPageResolver";
import User from "../models/User";
import { Tracer } from "tracer";


@Service()
export class DemoPageService
{

    @Inject("server") server: GrapheneServer;
    @Inject("logger") logger: Tracer.Logger;

    getAll()
    {
        return DemoPage.find();
    }

    getOne(id: string)
    {
        return DemoPage.findOne({where: {id}});
    }

    create(data: CreatePageInput, user: User)
    {

        const page = DemoPage.create({
            ...data, 
            author: user
        });

        console.log({
            ...data, 
            author: user
        });

        return page.save();
    }

    async edit(data: EditPageInput)
    {
        const page = await this.getOne(data.id);
        if (!page) throw new Error("Page not found: " + data.id);

        Object.assign(page, {
            ...data, 
            id: page.id
        });

        return page.save();
    }

    async delete(id: string)
    {
        const page = await this.getOne(id);
        if (!page) throw new Error("Page not found: " + id);

        return page.remove();
    }
}