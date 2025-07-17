export abstract class BaseEntity<ID> {
    protected id: ID;
    
    public getId(): ID {
        return this.id;
    }

    public setId(id: ID): void {
        this.id = id;
    }

    public equals(other: BaseEntity<ID>): boolean {
        if (this === other) return true;
        if (other == null || this.constructor !== other.constructor) return false;
        return this.id === other.id;
    }
    

}