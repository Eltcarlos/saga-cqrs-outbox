import { DomainEvent } from "@shared/domain/event/DomainEvent";
import { Order } from "../entity/Order";

export abstract class OrderEvent implements DomainEvent<Order> {
    private readonly order: Order;
    private readonly createdAt: Date;

    constructor(order: Order, createdAt: Date) {
        this.order = order;
        this.createdAt = createdAt;
    }

    getOrder(): Order {
        return this.order;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }
}