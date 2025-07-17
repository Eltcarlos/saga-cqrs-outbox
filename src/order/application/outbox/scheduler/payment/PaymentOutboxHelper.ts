import { OrderStatus } from "@shared/domain/value-object/OrderStatus";
import { OrderPaymentEventPayload } from "../../model/payment/OrderPaymentEventPayload";
import { SagaStatus } from "@shared/domain/value-object/SagaStatus";
import { OutboxStatus } from "@shared/domain/value-object/OutboxStatus";
import { EntityManager } from "typeorm";
import { OrderPaymentOutboxMessage } from "../../model/payment/OrderPaymentOutboxMessage";
import { v4 as uuidv4 } from 'uuid';
import { PaymentOutboxRepository } from "@order/application/ports/output/repository/PaymentOutboxRepository";
import { DomainException } from "@shared/domain/exception/DomainException";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PaymentOutboxHelper {
    private readonly SAGA_NAME = "OrderProcessingSaga";

    constructor(
        private readonly paymentOutboxRepository: PaymentOutboxRepository
    ) { }

    async save(orderPaymentOutboxMessage: OrderPaymentOutboxMessage, manager?: EntityManager): Promise<void> {
        const response : OrderPaymentOutboxMessage = await this.paymentOutboxRepository.save(orderPaymentOutboxMessage, manager);
        if (!response) {
            throw new DomainException("Failed to save OrderPaymentOutboxMessage", {
                cause: "Database error or invalid data",
                code: "ORDER_PAYMENT_OUTBOX_SAVE_FAILED"
            });
        }
        console.log("OrderPaymentOutboxMessage saved with ID:", response.getId());
    }

    async savePaymentOutboxMessage(manager: EntityManager, paymentEventPayload: OrderPaymentEventPayload, orderStatus: OrderStatus, sagaStatus: SagaStatus, outboxStatus: OutboxStatus, sagaId: string): Promise<void> {
        const payload = JSON.stringify(paymentEventPayload);
        return await this.save(
            new OrderPaymentOutboxMessage(
                uuidv4(),
                sagaId,
                paymentEventPayload.getCreatedAt(),
                this.SAGA_NAME,
                payload,
                sagaStatus,
                orderStatus,
                outboxStatus
            ),
            manager
        )
    }

    async getPaymentOutboxMessageByOutboxStatusAndSagaStatus(outboxStatus: OutboxStatus, sagaStatus: SagaStatus[]): Promise<OrderPaymentOutboxMessage[]> {
        return await this.paymentOutboxRepository.findByTypeAndSagaIdAndSagaStatus(this.SAGA_NAME,outboxStatus, sagaStatus);
    }
}