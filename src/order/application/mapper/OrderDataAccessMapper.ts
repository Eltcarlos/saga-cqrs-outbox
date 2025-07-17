import { Order } from "@order/domain/entity/Order";
import { OrderEntity } from "@order/infrastructure/entity/Order";
import { OrderItem } from "@order/domain/entity/OrderItem";
import { StreetAddress } from "@order/domain/value-object/StreetAddress";
import { TrackingId } from "@order/domain/value-object/TrackingId";
import { OrderId } from "@shared/domain/value-object/OrderId";
import { Money } from "@shared/domain/value-object/Money";
import { CustomerId } from "@shared/domain/value-object/CustomerId";
import { RestaurantId } from "@shared/domain/value-object/RestaurantId";
import { Product } from "@order/domain/entity/Product";
import { ProductId } from "@shared/domain/value-object/ProductId";
import { OrderItemId } from "@order/domain/value-object/OrderItemId";

export class OrderDataAccessMapper {
  orderToOrderEntity(order: Order): OrderEntity {

    const address: any = {
      id: order.getDeliveryAddress().getId(),
      street: order.getDeliveryAddress().getStreet(),
      postalCode: order.getDeliveryAddress().getPostalCode(),
      city: order.getDeliveryAddress().getCity(),
      order: undefined!,
    };

    const orderEntity: OrderEntity = {
      id: order.getId().getValue(),
      customerId: order.getCustomerId().getValue(),
      restaurantId: order.getRestaurantId().getValue(),
      trackingId: order.getTrackingId().getValue(),
      price: order.getPrice().getAmount(),
      orderStatus: order.getOrderStatus(),
      failureMessages: order.getFailureMessages().join(','),
      address,
      items: [],
    };

    address.order = orderEntity;
    orderEntity.items = order.getItems().map((item) => {
      return {
        id: item.getId().getValue(),
        order: orderEntity,
        productId: item.getProduct().getId().getValue(),
        price: item.getPrice().getAmount(),
        quantity: item.getQuantity(),
        subTotal: item.getSubTotal().getAmount(),
      } as any;
    });

    return orderEntity;
  }

  orderEntityToOrder(orderEntity: OrderEntity): Order {
    const deliveryAddress = new StreetAddress(
      orderEntity.address.id,
      orderEntity.address.street,
      orderEntity.address.postalCode,
      orderEntity.address.city
    );

    const orderId = new OrderId(orderEntity.id);

    const items: OrderItem[] = orderEntity.items.map((itemEntity, index) => {
      return new OrderItem(
        new Product(new ProductId(itemEntity.productId)),
        itemEntity.quantity,
        new Money(itemEntity.price),
        orderId,
        new OrderItemId(index + 1)
      );
    });

    const failureMessages = orderEntity.failureMessages
      ? orderEntity.failureMessages.split(',')
      : [];

    return new Order(
      new CustomerId(orderEntity.customerId),
      new RestaurantId(orderEntity.restaurantId),
      deliveryAddress,
      new Money(orderEntity.price),
      items,
      orderId,
      new TrackingId(orderEntity.trackingId),
      orderEntity.orderStatus,
      failureMessages
    );
  }
}
