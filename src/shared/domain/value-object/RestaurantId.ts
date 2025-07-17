import { BaseId } from "./BaseId";

export class RestaurantId extends BaseId<string> {
    constructor(id: string) {
        super(id);
    }
}