import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentOutboxDataAccessMapper } from "@order/application/mapper/PaymentOutboxDataAccessMapper";
import { OrderPaymentOutboxMessage } from "@order/application/outbox/model/payment/OrderPaymentOutboxMessage";
import { PaymentOutboxRepository } from "@order/application/ports/output/repository/PaymentOutboxRepository";
import { PaymentOutboxEntity } from "@order/infrastructure/entity/PaymentOutboxEntity";
import { OutboxStatus } from "@shared/domain/value-object/OutboxStatus";
import { SagaStatus } from "@shared/domain/value-object/SagaStatus";
import { EntityManager, In, Repository } from "typeorm";


@Injectable()
export class PaymentOutboxRepositoryImpl implements PaymentOutboxRepository {

    constructor(
        @InjectRepository(PaymentOutboxEntity)
        private readonly repository: Repository<PaymentOutboxEntity>,
        private readonly paymentOutboxDataAccessMapper: PaymentOutboxDataAccessMapper
    ) { }

    
    async findByTypeAndSagaIdAndSagaStatus(
        type: string,
        outboxStatus: OutboxStatus,
        sagaStatus: SagaStatus[]
    ): Promise<OrderPaymentOutboxMessage[]> {
        const entities = await this.repository.find({
            where: {
                type,
                outboxStatus,
                sagaStatus: In(sagaStatus),
            },
        });
        return entities.map(entity =>
            this.paymentOutboxDataAccessMapper.paymentOutboxEntityToOrderPaymentOutboxMessage(entity)
        );
    }

    async save(orderPaymentOutboxMessage: OrderPaymentOutboxMessage, manager: EntityManager): Promise<OrderPaymentOutboxMessage> {
        const repository = manager ? manager.getRepository(PaymentOutboxEntity) : this.repository;
        return this.paymentOutboxDataAccessMapper.paymentOutboxEntityToOrderPaymentOutboxMessage(await repository.save(this.paymentOutboxDataAccessMapper.orderPaymentOutboxMessageToOutboxEntity(orderPaymentOutboxMessage)));
    }

}