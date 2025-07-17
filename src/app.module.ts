import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@order/infrastructure/entity/Customer';
import { OrderEntity } from '@order/infrastructure/entity/Order';
import { OrderAddressEntity } from '@order/infrastructure/entity/OrderAddressEntity';
import { OrderItemEntity } from '@order/infrastructure/entity/OrderItemEntity';
import { PaymentOutboxEntity } from '@order/infrastructure/entity/PaymentOutboxEntity';
import { RestaurantEntity } from '@order/infrastructure/entity/Restaurant';
import { OrderModule } from '@order/order.module';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'postgres',
        database: configService.get<string>('DB_NAME') || 'order_service',
        synchronize: configService.get<boolean>('DB_SYNC') || false,
        entities: [CustomerEntity, RestaurantEntity, OrderEntity, OrderItemEntity, OrderAddressEntity, PaymentOutboxEntity], 
      }),
    }),
    OrderModule,
    SharedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
