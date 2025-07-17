import { Injectable } from "@nestjs/common";
import { CreateOrderCommandDTO } from "./dto/CreateOrderCommandDTO";
import { OrderCreatedEvent } from "@order/domain/event/OrderCreatedEvent";
import { Customer } from "@order/domain/entity/Customer";
import { CustomerRepository } from "./ports/output/repository/CustomerRepository";
import { OrderNotFoundException } from "@order/domain/exception/OrderNotFoundException";
import { Restaurant } from "@order/domain/entity/Restaurant";
import { RestaurantRepository } from "./ports/output/repository/RestaurantRepository";
import { OrderDataMapper } from "./mapper/OrderDataMapper";
import { RestaurantNotFoundException } from "@order/domain/exception/RestaurantNotFoundException";
import { OrderDomainService } from "@order/domain/OrderDomainService";
import { Order } from "@order/domain/entity/Order";
import { OrderRepository } from "./ports/output/repository/OrderRepository";
import { EntityManager } from "typeorm";


@Injectable()
export class OrderCreateHelper {

    constructor(
        private readonly customerRepository: CustomerRepository,
        private readonly restaurantRepository: RestaurantRepository,
        private readonly orderDataMapper: OrderDataMapper,
        private readonly orderDomainService: OrderDomainService,
        private readonly orderRepository: OrderRepository,
    ) { }

    async persistOrder(
        createOrderCommandDTO: CreateOrderCommandDTO,
        manager: EntityManager
    ): Promise<OrderCreatedEvent> {
        await this.checkCustomer(createOrderCommandDTO.customerId);
        const restaurant: Restaurant = await this.checkRestaurant(createOrderCommandDTO);
        const order: Order = this.orderDataMapper.createOrderCommandToOrder(createOrderCommandDTO);
        const orderCreatedEvent: OrderCreatedEvent = this.orderDomainService.validateAndInitiateOrder(order, restaurant);
        await this.saveOrder(order, manager);
        return orderCreatedEvent;
    }

    
    private async checkRestaurant(createOrderCommandDTO: CreateOrderCommandDTO): Promise<Restaurant> {
        const restaurant: Restaurant | null = this.orderDataMapper.createOrderCommandToRestaurant(createOrderCommandDTO);
        const optionalRestaurant: Restaurant | null = await this.restaurantRepository.findRestaurantInformation(restaurant);
        if (!optionalRestaurant) {
            throw new RestaurantNotFoundException(`Restaurant with ID ${createOrderCommandDTO.restaurantId} not found.`, {
                cause: "restaurant has not been created yet.",
                code: "RESTAURANT_NOT_FOUND"
            });
        }
        return optionalRestaurant;
    }

    private async checkCustomer(customerId: string): Promise<void> {
        const customer: Customer | null = await this.customerRepository.findCustomer(customerId);
        if (!customer) {
            throw new OrderNotFoundException(`Customer with ID ${customerId} not found.`, {
                cause: "customer has not been created yet.",
                code: "CUSTOMER_NOT_FOUND"
            });
        }
    }

    private async saveOrder(order: Order, manager: EntityManager): Promise<void> {
        const orderSaved: Order | null = await this.orderRepository.save(order, manager);
        if (!orderSaved) {
            throw new OrderNotFoundException(`Order with ID ${order.getId().getValue()} could not be saved.`, {
                cause: "order could not be saved in the database.",
                code: "ORDER_NOT_SAVED"
            });
        }
    }
}