import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, Int, ObjectType, ID,  } from "type-graphql";
import { GrapheneUserRole } from "./enums/GrapheneUserRole";

@ObjectType()
@Entity()
export default class GrapheneUser extends BaseEntity
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

    @Column("varchar")
    @Field(type => GrapheneUserRole)
    role: GrapheneUserRole;
}   