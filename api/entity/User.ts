import {Entity, ObjectIdColumn, ObjectID, Column} from "https://denolib.com/denolib/typeorm@v0.2.23-rc8/mod.ts";

@Entity()
export class User {

    @ObjectIdColumn()
    id: ObjectID;

    @Column({ type: String })
    firstName: string;

    @Column({ type: String })
    lastName: string;

    @Column({ type: Number })
    age: number;

}
 