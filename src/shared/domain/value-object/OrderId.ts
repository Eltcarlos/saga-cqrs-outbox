import { BaseId } from "./BaseId";

export class OrderId extends BaseId<string> {
    constructor(id: string) {
        super(id);
    }
}