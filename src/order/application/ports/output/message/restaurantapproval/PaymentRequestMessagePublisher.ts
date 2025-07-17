import { OrderPaymentOutboxMessage } from "@order/application/outbox/model/payment/OrderPaymentOutboxMessage";
import { OutboxStatus } from "@shared/domain/value-object/OutboxStatus";

export abstract class PaymentRequestMessagePublisher {
  abstract publish(
    orderPaymentOutboxMessage: OrderPaymentOutboxMessage,
    outboxCallback: (message: OrderPaymentOutboxMessage, status: OutboxStatus) => void,
  ): Promise<void>;
}
