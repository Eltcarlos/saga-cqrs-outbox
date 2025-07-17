
export class OrderPaymentEventPayload {
    private readonly orderId: string;
    private readonly customerId: string;
    private readonly price: number;    
    private readonly createdAt: Date;
    private readonly paymentOrderStatus: string;

     constructor(
        orderId?: string,
        customerId?: string,
        price?: number,
        createdAt?: Date,
        paymentOrderStatus?: string
    ) {
        if (orderId) this.orderId = orderId;
        if (customerId) this.customerId = customerId;
        if (price) this.price = price;
        if (createdAt) this.createdAt = createdAt;
        if (paymentOrderStatus) this.paymentOrderStatus = paymentOrderStatus;
    }

    getOrderId(): string {
        return this.orderId;
    }

    getCustomerId(): string {
        return this.customerId;
    }

    getPrice(): number {
        return this.price;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getPaymentOrderStatus(): string {
        return this.paymentOrderStatus;
    }
}