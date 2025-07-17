import { BaseId } from "@shared/domain/value-object/BaseId";

export class TrackingId extends BaseId<string> {
    constructor(id: string) {
        super(id);
    }

}