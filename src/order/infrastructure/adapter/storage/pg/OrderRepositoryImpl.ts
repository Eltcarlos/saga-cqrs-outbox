import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDataAccessMapper } from "@order/application/mapper/OrderDataAccessMapper";
import { OrderRepository } from "@order/application/ports/output/repository/OrderRepository";
import { Order } from "@order/domain/entity/Order";
import { TrackingId } from "@order/domain/value-object/TrackingId";
import { OrderEntity } from "@order/infrastructure/entity/Order";
import { OrderId } from "@shared/domain/value-object/OrderId";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {

    constructor(
        @InjectRepository(OrderEntity)
        private readonly repository: Repository<OrderEntity>,
        private readonly orderDataAccessMapper: OrderDataAccessMapper
    ) { }

    async save(order: Order, manager: EntityManager): Promise<Order> {
        const repository = manager ? manager.getRepository(OrderEntity) : this.repository;
        const orderEntity = this.orderDataAccessMapper.orderToOrderEntity(order);
        const savedEntity = await repository.save(orderEntity);
        return this.orderDataAccessMapper.orderEntityToOrder(savedEntity);
    }

    async findById(orderId: OrderId): Promise<Order | null> {
        const orderEntity = await this.repository.findOne({
            where: { id: orderId.getValue() },
            relations: ['address', 'items'],
        });
        return orderEntity ? this.orderDataAccessMapper.orderEntityToOrder(orderEntity) : null;
    }

    async findByTrackingId(trackingId: TrackingId): Promise<Order | null> {
        const orderEntity = await this.repository.findOne({
            where: { trackingId: trackingId.getValue() },
            relations: ['address', 'items'],
        });
        return orderEntity ? this.orderDataAccessMapper.orderEntityToOrder(orderEntity) : null;
    }

}
