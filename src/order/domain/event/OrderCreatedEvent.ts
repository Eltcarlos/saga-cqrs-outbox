import { Order } from "../entity/Order";
import { OrderEvent } from "./OrderEvent";

export class OrderCreatedEvent extends OrderEvent {
    constructor(order: Order, createdAt: Date) {
        super(order, createdAt);
    }
}