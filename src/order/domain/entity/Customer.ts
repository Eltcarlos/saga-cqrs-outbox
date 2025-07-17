import { AggregateRoot } from "@shared/domain/entity/AggregateRoot";
import { CustomerId } from "@shared/domain/value-object/CustomerId";


export class Customer extends AggregateRoot<CustomerId> {

    private readonly username: string;
    private readonly firstName: string;
    private readonly lastName: string;

    constructor(id: CustomerId, username: string, firstName: string, lastName: string) {
        super();
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
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