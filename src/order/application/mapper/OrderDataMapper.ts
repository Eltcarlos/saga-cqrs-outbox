import { Restaurant } from "@order/domain/entity/Restaurant";
import { CreateOrderCommandDTO } from "../dto/CreateOrderCommandDTO";
import { RestaurantId } from "@shared/domain/value-object/RestaurantId";
import { Product } from "@order/domain/entity/Product";
import { ProductId } from "@shared/domain/value-object/ProductId";
import { Money } from "@shared/domain/value-object/Money";
import { Order } from "@order/domain/entity/Order";
import { CustomerId } from "@shared/domain/value-object/CustomerId";
import { StreetAddress } from "@order/domain/value-object/StreetAddress";
import { OrderItem } from "@order/domain/entity/OrderItem";
import { OrderId } from "@shared/domain/value-object/OrderId";
import { v4 as uuidv4 } from 'uuid';
import { OrderItemId } from "@order/domain/value-object/OrderItemId";
import { CreateOrderResponseDTO } from "../dto/CreateOrderResponseDTO";
import { OrderPaymentEventPayload } from "../outbox/model/payment/OrderPaymentEventPayload";
import { OrderCreatedEvent } from "@order/domain/event/OrderCreatedEvent";

export class OrderDataMapper {

    createOrderCommandToRestaurant(createOrderCommandDTO: CreateOrderCommandDTO): Restaurant {
        const products = createOrderCommandDTO.items.map(product =>
            new Product(
                new ProductId(product.productId),
                undefined,
                new Money(product.price)
            )
        );

        return new Restaurant(
            new RestaurantId(createOrderCommandDTO.restaurantId),
            products,
            true
        );
    }

    createOrderCommandToOrder(createOrderCommandDTO: CreateOrderCommandDTO): Order {
        const address = createOrderCommandDTO.address;

        const items: OrderItem[] = createOrderCommandDTO.items.map((item, index) => {
            return new OrderItem(
                new Product(
                    new ProductId(item.productId),
                    undefined,
                    new Money(item.price)
                ),
                item.quantity,
                new Money(item.price),
                new OrderId(uuidv4()),
                new OrderItemId(index + 1)
            );
        });
        return new Order(
            new CustomerId(createOrderCommandDTO.customerId),
            new RestaurantId(createOrderCommandDTO.restaurantId),
            new StreetAddress(
                address.street,
                address.postalCode,
                address.city,
            ),
            new Money(createOrderCommandDTO.price),
            items,
        )
    }

    orderToCreateOrderResponse(order: Order, message: string): CreateOrderResponseDTO {
        return new CreateOrderResponseDTO(
            order.getTrackingId().getValue(),
            order.getOrderStatus(),
            message
        )
    }

    orderCreatedEventToOrderPaymentEventPayload(orderCreatedEvent: OrderCreatedEvent): OrderPaymentEventPayload {
        return new OrderPaymentEventPayload(
            orderCreatedEvent.getOrder().getId().getValue(),
            orderCreatedEvent.getOrder().getCustomerId().getValue(),
            orderCreatedEvent.getOrder().getPrice().getAmount(),
            orderCreatedEvent.getCreatedAt(),
            orderCreatedEvent.getOrder().getOrderStatus()
        )
    }

}