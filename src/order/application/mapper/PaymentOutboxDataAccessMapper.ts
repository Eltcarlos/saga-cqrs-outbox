import { PaymentOutboxEntity } from "@order/infrastructure/entity/PaymentOutboxEntity";
import { OrderPaymentOutboxMessage } from "../outbox/model/payment/OrderPaymentOutboxMessage";

export class PaymentOutboxDataAccessMapper {
  
  paymentOutboxEntityToOrderPaymentOutboxMessage(entity: PaymentOutboxEntity): OrderPaymentOutboxMessage {
    return new OrderPaymentOutboxMessage(
      entity.getId(),
      entity.getSagaId(),
      entity.getCreatedAt(),
      entity.getType(),
      entity.getPayload(),
      entity.getSagaStatus(),
      entity.getOrderStatus(),
      entity.getOutboxStatus(),
      entity.getVersion(),
      entity.getProcessedAt()
    );
  }

  orderPaymentOutboxMessageToOutboxEntity(domain: OrderPaymentOutboxMessage): PaymentOutboxEntity {
    return new PaymentOutboxEntity(
      domain.getId(),
      domain.getSagaId(),
      domain.getCreatedAt(),
      domain.getType(),
      domain.getPayload(),
      domain.getSagaStatus(),
      domain.getOrderStatus(),
      domain.getOutboxStatus(),
      domain.getVersion(),
      domain.getProcessedAt()
    );
  }
}
