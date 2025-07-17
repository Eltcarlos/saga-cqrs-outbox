import { AggregateRoot } from "@shared/domain/entity/AggregateRoot";
import { CustomerId } from "@shared/domain/value-object/CustomerId";
import { OrderId } from "@shared/domain/value-object/OrderId";
import { RestaurantId } from "@shared/domain/value-object/RestaurantId";
import { StreetAddress } from "../value-object/StreetAddress";
import { Money } from "@shared/domain/value-object/Money";
import { OrderItem } from "./OrderItem";
import { OrderStatus } from "@shared/domain/value-object/OrderStatus";
import { TrackingId } from "../value-object/TrackingId";
import { v4 as uuidv4 } from 'uuid';
import { OrderItemId } from "../value-object/OrderItemId";
import { DomainException } from "@shared/domain/exception/DomainException";

export class Order extends AggregateRoot<OrderId> {
    private readonly customerId: CustomerId;
    private readonly restaurantId: RestaurantId;
    private readonly deliveryAddress: StreetAddress;
    private readonly price: Money;
    private readonly items: OrderItem[];

    private trackingId: TrackingId;
    private orderStatus: OrderStatus;
    private failureMessages: string[] = [];

    public static readonly FAILURE_MESSAGE_DELIMITER = ",";

    constructor(
        customerId: CustomerId,
        restaurantId: RestaurantId,
        deliveryAddress: StreetAddress,
        price: Money,
        items: OrderItem[],
        orderId?: OrderId,
        trackingId?: TrackingId,
        orderStatus?: OrderStatus,
        failureMessages?: string[]
    ) {
        super();
        this.customerId = customerId;
        this.restaurantId = restaurantId;
        this.deliveryAddress = deliveryAddress;
        this.price = price;
        this.items = items;
        this.setId(orderId ?? new OrderId(uuidv4()));
        this.trackingId = trackingId ?? new TrackingId(uuidv4());
        this.orderStatus = orderStatus ?? OrderStatus.PENDING;
        this.failureMessages = failureMessages ?? [];
    }

    // --- Initialization Logic ---

    initializeOrder(): void {
        this.trackingId = new TrackingId(uuidv4());
        this.orderStatus = OrderStatus.PENDING;
        let itemId = 1;
        for (const item of this.items) {
            item.initializeOrderItem(this.getId(), item.getId() ?? new OrderItemId(itemId++));
        }
    }

    // --- Domain Logic ---

    validateOrder(): void {
        this.validateInitialOrder();
        this.validateTotalPrice();
        this.validateItemsPrice();
    }

    private validateInitialOrder(): void {
        if (this.orderStatus !== OrderStatus.PENDING) {
            throw new DomainException("Order must be in PENDING state to validate!", {
                orderId: this.getId().getValue(),
                orderStatus: this.orderStatus,
            });
        }
    }

    private validateTotalPrice(): void {
        if (!this.price.isGreaterThanZero()) {
            throw new DomainException("Order price must be greater than zero!", {
                orderId: this.getId().getValue(),
                price: this.price.getAmount(),
            });
        }
    }

    private validateItemsPrice(): void {
        const total = this.items
            .map(item => item.getSubTotal())
            .reduce((a, b) => a.add(b), new Money(0));

        if (!this.price.equals(total)) {
            throw new DomainException("Order price does not match the sum of item prices!", {
                orderId: this.getId().getValue(),
                expectedPrice: total.getAmount(),
            });
        }
    }

    pay(): void {
        if (this.orderStatus !== OrderStatus.PENDING) {
            throw new DomainException("Order is not in correct state for pay operation!", {
                orderId: this.getId().getValue(),
                orderStatus: this.orderStatus,
            });
        }
        this.orderStatus = OrderStatus.PAID;
    }

    approve(): void {
        if (this.orderStatus !== OrderStatus.PAID) {
            throw new DomainException("Order is not in correct state for approve operation!", {
                orderId: this.getId().getValue(),
                orderStatus: this.orderStatus,
            });
        }
        this.orderStatus = OrderStatus.APPROVED;
    }

    initCancel(failureMessages: string[]): void {
        if (this.orderStatus !== OrderStatus.PAID) {
            throw new DomainException("Order is not in correct state for cancel operation!", {
                orderId: this.getId().getValue(),
                orderStatus: this.orderStatus,
            });
        }
        this.orderStatus = OrderStatus.CANCELLING;
        this.updateFailureMessages(failureMessages);
    }

    cancel(failureMessages: string[]): void {
        if (![OrderStatus.CANCELLING, OrderStatus.PENDING].includes(this.orderStatus)) {
            throw new DomainException("Order is not in correct state for cancel operation!", {
                orderId: this.getId().getValue(),
                orderStatus: this.orderStatus,  
            });
        }
        this.orderStatus = OrderStatus.CANCELLED;
        this.updateFailureMessages(failureMessages);
    }

    private updateFailureMessages(messages: string[]): void {
        this.failureMessages = [...(this.failureMessages || []), ...messages.filter(Boolean)];
    }

    // --- Getters ---

    getCustomerId(): CustomerId {
        return this.customerId;
    }

    getRestaurantId(): RestaurantId {
        return this.restaurantId;
    }

    getDeliveryAddress(): StreetAddress {
        return this.deliveryAddress;
    }

    getPrice(): Money {
        return this.price;
    }

    getItems(): OrderItem[] {
        return this.items;
    }

    getTrackingId(): TrackingId {
        return this.trackingId;
    }

    getOrderStatus(): OrderStatus {
        return this.orderStatus;
    }

    getFailureMessages(): string[] {
        return this.failureMessages;
    }
}
