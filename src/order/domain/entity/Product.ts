import { BaseEntity } from "@shared/domain/entity/BaseEntity";
import { Money } from "@shared/domain/value-object/Money";
import { ProductId } from "@shared/domain/value-object/ProductId";

export class Product extends BaseEntity<ProductId> {
    private name: string;
    private price: Money;

    constructor(productId: ProductId, name?: string, price?: Money) {
        super();
        this.setId(productId);
        if (name) this.name = name;
        if (price) this.price = price;
    }

    updateWithConfirmedNameAndPrice(name: string, price: Money): void {
        this.name = name;
        this.price = price;
    }

    getName(): string {
        return this.name;
    }

    getPrice(): Money {
        return this.price;
    }
}
