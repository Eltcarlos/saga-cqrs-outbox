import { v4 as uuidv4 } from 'uuid';

export class StreetAddress {
    private readonly id?: string;
    private readonly street: string;
    private readonly city: string;
    private readonly postalCode: string;

    constructor(street: string, city: string, postalCode: string, id?: string,) {
        this.id = id || uuidv4();
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
    }

    getId(): string {
        return this.id ? this.id : '';
    }

    getStreet(): string {
        return this.street;
    }

    getCity(): string {
        return this.city;
    }

    getPostalCode(): string {
        return this.postalCode;
    }
}