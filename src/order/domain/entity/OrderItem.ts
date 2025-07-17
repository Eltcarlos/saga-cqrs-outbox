import { BaseEntity } from "@shared/domain/entity/BaseEntity";
import { OrderId } from "@shared/domain/value-object/OrderId";
import { Product } from "./Product";
import { Money } from "@shared/domain/value-object/Money";
import { OrderItemId } from "../value-object/OrderItemId";

export class OrderItem extends BaseEntity<OrderItemId> {
    private orderId: OrderId;
    private readonly product: Product;
    private readonly quantity: number;
    private readonly price: Money;
    private readonly subTotal: Money;

    constructor(
        product: Product,
        quantity: number,
        price: Money,
        orderId: OrderId,
        orderItemId: OrderItemId
    ) {
        super();
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.subTotal = price.multiply(quantity);
        this.orderId = orderId;
        this.setId(orderItemId);
    }


    initializeOrderItem(orderId: OrderId, orderItemId: OrderItemId): void {
        this.orderId = orderId;
        this.setId(orderItemId);
    }

    isPriceValid(): boolean {
        return (
            this.price.isGreaterThanZero() &&
            this.price.equals(this.product.getPrice()) &&
            this.price.multiply(this.quantity).equals(this.subTotal)
        );
    }

    getOrderId(): OrderId | undefined {
        return this.orderId;
    }

    getProduct(): Product {
        return this.product;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getPrice(): Money {
        return this.price;
    }

    getSubTotal(): Money {
        return this.subTotal;
    }
}
