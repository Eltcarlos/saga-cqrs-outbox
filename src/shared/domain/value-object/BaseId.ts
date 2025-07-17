
export abstract class BaseId<ID> {

    private readonly id: ID;
    
    protected constructor(id: ID) {
        this.id = id;
    }

    public getValue(): ID {
        return this.id;
    }

    public equals(other: BaseId<ID>): boolean {
        if (this === other) return true;
        if (other == null || this.constructor !== other.constructor) return false;
        return this.id === other.id;
    }
}