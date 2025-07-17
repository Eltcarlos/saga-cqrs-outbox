
export type Primitives = string | number | boolean | Date | null | undefined;

export abstract class ValueObject<T extends Primitives> {
    readonly value: T;

    constructor(value: T) {
        this.value = value;
    }

    equals(other: ValueObject<T>): boolean {
        return (
            other.constructor.name === this.constructor.name &&
            other.value === this.value
        )
    }

    tostring(): string {
        return JSON.stringify(this.value);
    }


}