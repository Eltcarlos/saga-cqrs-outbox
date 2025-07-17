import { Injectable } from "@nestjs/common";
import { CreateOrderCommandDTO } from "./dto/CreateOrderCommandDTO";
import { CreateOrderResponseDTO } from "./dto/CreateOrderResponseDTO";
import { OrderCreatedEvent } from "@order/domain/event/OrderCreatedEvent";
import { OrderCreateHelper } from "./OrderCreateHelper";
import { DataSource } from "typeorm";
import { OrderDataMapper } from "./mapper/OrderDataMapper";
import { PaymentOutboxHelper } from "./outbox/scheduler/payment/PaymentOutboxHelper";
import { OutboxStatus } from "@shared/domain/value-object/OutboxStatus";
import { v4 as uuidv4 } from 'uuid';
import { OrderSagaHelper } from "./saga/OrderSagaHelper";

@Injectable()
export class OrderCreateCommandHandler {

    constructor(private readonly orderCreateHelper: OrderCreateHelper, private readonly orderDataMapper: OrderDataMapper, private readonly dataSource: DataSource,
        private readonly paymentOutboxHelper: PaymentOutboxHelper, private readonly orderSagaHelper: OrderSagaHelper
    ) {
    }

    async createOrder(createOrderCommandDTO: CreateOrderCommandDTO): Promise<CreateOrderResponseDTO> {
        return await this.dataSource.transaction(async (manager) => {
            const orderCreatedEvent: OrderCreatedEvent = await this.orderCreateHelper.persistOrder(createOrderCommandDTO, manager);
            console.log("Order is created with id: {}", orderCreatedEvent.getOrder().getId().getValue());
            const createOrderResponse: CreateOrderResponseDTO = this.orderDataMapper.orderToCreateOrderResponse(orderCreatedEvent.getOrder(), "Order created successfully");
            console.log("Returning CreateOrderResponse with order id", orderCreatedEvent.getOrder().getId());
            await this.paymentOutboxHelper.savePaymentOutboxMessage(
                manager,
                this.orderDataMapper
                    .orderCreatedEventToOrderPaymentEventPayload(orderCreatedEvent),
                orderCreatedEvent.getOrder().getOrderStatus(),
                this.orderSagaHelper.orderStatusToSagaStatus(orderCreatedEvent.getOrder().getOrderStatus()),
                OutboxStatus.STARTED,
                uuidv4()
            )
            return createOrderResponse;
        }
        )
    }
}