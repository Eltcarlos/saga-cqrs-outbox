import { Order } from "./entity/Order";
import { Restaurant } from "./entity/Restaurant";
import { OrderCreatedEvent } from "./event/OrderCreatedEvent";

export abstract class OrderDomainService {
    abstract validateAndInitiateOrder(order: Order, restaurant: Restaurant): OrderCreatedEvent;
}