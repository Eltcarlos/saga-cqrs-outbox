import { Injectable } from "@nestjs/common";
import { OrderPaymentOutboxMessage } from "@order/application/outbox/model/payment/OrderPaymentOutboxMessage";
import { PaymentRequestMessagePublisher } from "@order/application/ports/output/message/restaurantapproval/PaymentRequestMessagePublisher";
import { OutboxStatus } from "@shared/domain/value-object/OutboxStatus";
import { KafkaMessageHelper } from "./KafkaMessageHelper";
import { OrderPaymentEventPayload } from "@order/application/outbox/model/payment/OrderPaymentEventPayload";
import { KafkaProducer } from "@order/application/ports/output/message/kafka/KafkaProducer";



@Injectable()
export class OrderPaymentEventKafkaPublisherImpl implements PaymentRequestMessagePublisher {

    constructor(private readonly kafkaMessageHelper: KafkaMessageHelper, private readonly orderMessagingDataMapper: OrderMessagingDataMapper, private readonly kafkaProducer: KafkaProducer<string, any>){}

    async publish(orderPaymentOutboxMessage: OrderPaymentOutboxMessage, outboxCallback: (message: OrderPaymentOutboxMessage, status: OutboxStatus) => void): Promise<void> {
        const orderPaymentEventPayload = this.kafkaMessageHelper.getOrderEventPayload(orderPaymentOutboxMessage.getPayload(),
            OrderPaymentEventPayload);
        const sagaId = orderPaymentOutboxMessage.getSagaId().toString();
        console.log(`Received OrderPaymentOutboxMessage for order id: ${orderPaymentEventPayload.getOrderId()} and saga id: ${sagaId}`);
        try {
            console.log(`Publishing OrderPaymentOutboxMessage with ID: ${orderPaymentOutboxMessage.getId()}`);
            const paymentRequestAvroModel = this.orderMessagingDataMapper.orderPaymentEventToPaymentRequestAvroModel(sagaId, orderPaymentEventPayload);
            this.kafkaProducer.send('order-service', sagaId, paymentRequestAvroModel, this.kafkaMessageHelper.('order-service', paymentRequestAvroModel, orderPaymentOutboxMessage, outboxCallback, orderPaymentEventPayload.getOrderId(), 'PaymentRequestAvroModel'));
        } catch (error) {
            console.error(`Error processing OrderPaymentOutboxMessage for order id: ${orderPaymentEventPayload.getOrderId()} and saga id: ${sagaId}`, error);
        }
    }
    
}