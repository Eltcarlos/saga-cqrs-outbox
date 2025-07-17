import { Order } from "@order/domain/entity/Order";
import { TrackingId } from "@order/domain/value-object/TrackingId";
import { OrderId } from "@shared/domain/value-object/OrderId";
import { EntityManager } from "typeorm";

export abstract class OrderRepository {
    abstract save(order: Order, manager: EntityManager): Promise<Order>;
    abstract findById(orderId: OrderId): Promise<Order | null>;
    abstract findByTrackingId(trackingId: TrackingId): Promise<Order | null>;
}