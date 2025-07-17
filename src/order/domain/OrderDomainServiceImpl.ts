import { DomainException } from "@shared/domain/exception/DomainException";
import { Order } from "./entity/Order";
import { Restaurant } from "./entity/Restaurant";
import { OrderCreatedEvent } from "./event/OrderCreatedEvent";
import { OrderDomainService } from "./OrderDomainService";


export class OrderDomainServiceImpl implements OrderDomainService {

    validateAndInitiateOrder(order: Order, restaurant: Restaurant): OrderCreatedEvent {
        this.validateRestaurant(restaurant);
        this.setOrderProductInformation(order, restaurant);
        order.validateOrder();
        order.initializeOrder();
        console.log(`Order with ID ${order.getId().getValue()} has been created successfully.`);
        return new OrderCreatedEvent(order, new Date());
    }


    private setOrderProductInformation(order: Order, restaurant: Restaurant): void {
        order.getItems().forEach(orderItem => {
            const currentProduct = orderItem.getProduct();

            restaurant.getProducts().forEach(restaurantProduct => {
                if (currentProduct.equals(restaurantProduct)) {
                    currentProduct.updateWithConfirmedNameAndPrice(
                        restaurantProduct.getName(),
                        restaurantProduct.getPrice()
                    );
                }
            });
        });
    }


    private validateRestaurant(restaurant: Restaurant): void {
        if (!restaurant.isActive()) {
            throw new DomainException(
                `Restaurant with ID ${restaurant.getId().getValue()} is not active.`,
                {
                    cause: "restaurant is not active.",
                    code: "RESTAURANT_NOT_ACTIVE"
                },
                400
            );
        }
    }
}