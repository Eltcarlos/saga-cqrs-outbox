import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('Customer')
export class CustomerEntity {

    @PrimaryColumn({
        type: "uuid",
    })
    public readonly id: string;

    @Column()
    private readonly username: string;

    @Column()
    private readonly firstName: string;

    @Column()
    private readonly lastName: string;

    constructor(id: string, username: string, firstName: string, lastName: string) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public getId(): string {
        return this.id;
    }
    public getUsername(): string {
        return this.username;
    }
    public getFirstName(): string {
        return this.firstName;
    }
    public getLastName(): string {
        return this.lastName;
    }

}