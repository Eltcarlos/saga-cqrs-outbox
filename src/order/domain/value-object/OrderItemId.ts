import { BaseId } from "@shared/domain/value-object/BaseId";

export class OrderItemId extends BaseId<number> {
    constructor(id: number) {
        super(id);
    }
}