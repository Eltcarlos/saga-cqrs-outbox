import { AggregateRoot } from "@shared/domain/entity/AggregateRoot";
import { RestaurantId } from "@shared/domain/value-object/RestaurantId";
import { Product } from "./Product";

export class Restaurant extends AggregateRoot<RestaurantId> {
    private readonly products: Product[];
    private readonly active: boolean;

    constructor(id: RestaurantId, products: Product[], active: boolean) {
        super();
        this.id = id;
        this.products = products;
        this.active = active;
    }

    public getProducts(): Product[] {
        return this.products;
    }

    public isActive(): boolean {
        return this.active;
    }
}