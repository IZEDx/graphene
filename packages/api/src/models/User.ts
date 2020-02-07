import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, ObjectType, ID,  } from "type-graphql";
import { UserRole } from "./enums/UserRole";
import { Password } from "./scalars/Password";

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
    @Field(type => Password)
    password: string;

    @Column("varchar")
    @Field(type => UserRole)
    role: UserRole;
}   