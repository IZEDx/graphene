import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Field, ObjectType, ID,  } from "type-graphql";
import User from "./User";
import { Lazy } from "../libs/utils";

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

    @Field(type => User)
    @ManyToOne(type => User, { lazy: true })
    author: Lazy<User>;
}   