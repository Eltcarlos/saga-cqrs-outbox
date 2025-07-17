import { Module } from '@nestjs/common';
import { OrderController } from './infrastructure/controllers/OrderController';
import { OrderApplicationService } from './application/ports/input/service/orderApplicationService';
import { OrderApplicationServiceImpl } from './application/impl/input/OrderApplicationServiceImpl';
import { OrderCreateCommandHandler } from './application/OrderCreateCommandHandler';
import { OrderCreateHelper } from './application/OrderCreateHelper';
import { CustomerRepository } from './application/ports/output/repository/CustomerRepository';
import { CustomerRepositoryImpl } from './infrastructure/adapter/storage/pg/CustomerRepositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './infrastructure/entity/Customer';
import { CustomerDataAccessMapper } from './application/mapper/CustomerDataAccessMapper';
import { RestaurantEntity } from './infrastructure/entity/Restaurant';
import { RestaurantRepository } from './application/ports/output/repository/RestaurantRepository';
import { RestaurantRepositoryImpl } from './infrastructure/adapter/storage/pg/RestaurantRepositoryImpl';
import { RestaurantDataAccessMapper } from './application/mapper/RestaurantDataAccessMapper';
import { OrderDataMapper } from './application/mapper/OrderDataMapper';
import { OrderDomainService } from './domain/OrderDomainService';
import { OrderDomainServiceImpl } from './domain/OrderDomainServiceImpl';
import { OrderRepository } from './application/ports/output/repository/OrderRepository';
import { OrderRepositoryImpl } from './infrastructure/adapter/storage/pg/OrderRepositoryImpl';
import { OrderEntity } from './infrastructure/entity/Order';
import { OrderItemEntity } from './infrastructure/entity/OrderItemEntity';
import { OrderAddressEntity } from './infrastructure/entity/OrderAddressEntity';
import { OrderDataAccessMapper } from './application/mapper/OrderDataAccessMapper';
import { PaymentOutboxHelper } from './application/outbox/scheduler/payment/PaymentOutboxHelper';
import { OrderSagaHelper } from './application/saga/OrderSagaHelper';
import { PaymentOutboxEntity } from './infrastructure/entity/PaymentOutboxEntity';
import { PaymentOutboxDataAccessMapper } from './application/mapper/PaymentOutboxDataAccessMapper';
import { PaymentOutboxRepository } from './application/ports/output/repository/PaymentOutboxRepository';
import { PaymentOutboxRepositoryImpl } from './infrastructure/adapter/storage/pg/PaymentOutboxRepositoryImpl';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentOutboxScheduler } from './application/outbox/scheduler/payment/PaymentOutboxScheduler';
import { OrderPaymentEventKafkaPublisherImpl } from './infrastructure/publisher/kafka/OrderPaymentEventKafkaPublisher';
import { PaymentRequestMessagePublisher } from './application/ports/output/message/restaurantapproval/PaymentRequestMessagePublisher';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, RestaurantEntity, OrderEntity, OrderItemEntity, OrderAddressEntity, PaymentOutboxEntity]),
    ScheduleModule.forRoot()
  ],
  controllers: [OrderController],
  providers: [
    OrderCreateCommandHandler, OrderCreateHelper, OrderDataMapper, CustomerDataAccessMapper, RestaurantDataAccessMapper, PaymentOutboxDataAccessMapper, OrderDataAccessMapper, PaymentOutboxHelper, OrderSagaHelper, PaymentOutboxScheduler,
    {
      provide: OrderApplicationService,
      useClass: OrderApplicationServiceImpl
    },
    {
      provide: CustomerRepository,
      useClass: CustomerRepositoryImpl
    },
    {
      provide: RestaurantRepository,
      useClass: RestaurantRepositoryImpl
    },
    {
      provide: PaymentOutboxRepository,
      useClass: PaymentOutboxRepositoryImpl
    },
    {
      provide: OrderRepository,
      useClass: OrderRepositoryImpl,
    },
    {
      provide: OrderDomainService,
      useClass: OrderDomainServiceImpl,
    },
    {
      provide: PaymentRequestMessagePublisher,
      useClass: OrderPaymentEventKafkaPublisherImpl,
    },
  ],
})
export class OrderModule { }
