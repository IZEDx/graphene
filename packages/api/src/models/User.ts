import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, Int, ObjectType, ID,  } from "type-graphql";
import { UserRole } from "./enums/UserRole";

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

    @Column("varchar")
    @Field(type => UserRole)
    role: UserRole;
}   