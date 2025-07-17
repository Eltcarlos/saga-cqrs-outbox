import { OrderPaymentOutboxMessage } from "@order/application/outbox/model/payment/OrderPaymentOutboxMessage";
import { OutboxStatus } from "@shared/domain/value-object/OutboxStatus";
import { SagaStatus } from "@shared/domain/value-object/SagaStatus";
import { EntityManager } from "typeorm";

export abstract class PaymentOutboxRepository {
    abstract save(orderPaymentOutboxMessage: OrderPaymentOutboxMessage,  manager?: EntityManager) : Promise<OrderPaymentOutboxMessage>;
    abstract findByTypeAndSagaIdAndSagaStatus(type: string, outboxStatus: OutboxStatus, sagaStatus: SagaStatus[]): Promise<OrderPaymentOutboxMessage[]>;
}
