import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, Int, ObjectType, ID,  } from "type-graphql";

@ObjectType()
@Entity()
export default class User extends BaseEntity
{
    @PrimaryGeneratedColumn()
    @Field(type => ID)
    id: string;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    password: string;
}