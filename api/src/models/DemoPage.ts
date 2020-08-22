import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Field, ObjectType, ID,  } from "type-graphql";
import User from "./User";
import { Lazy } from "../libs/utils";
import { RichContent } from "./scalars/RichContent";

@ObjectType()
@Entity()
export default class DemoPage extends BaseEntity
{
    @PrimaryGeneratedColumn()
    @Field(type => ID)
    id: string;

    @Column()
    @Field()
    title: string;

    @Column()
    @Field(type => RichContent)
    content: string;

    @Field(type => User)
    @ManyToOne(type => User, { lazy: true })
    author: Lazy<User>;

    @Field()
    @Column()
    visible: boolean;
}    