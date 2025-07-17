import { BaseId } from "./BaseId";

export class CustomerId extends BaseId<string> {
    constructor(id: string) {
        super(id);
    }
}