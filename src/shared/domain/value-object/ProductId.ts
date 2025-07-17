import { BaseId } from "./BaseId";

export class ProductId extends BaseId<string> {
    constructor(id: string) {
        super(id);
    }
}