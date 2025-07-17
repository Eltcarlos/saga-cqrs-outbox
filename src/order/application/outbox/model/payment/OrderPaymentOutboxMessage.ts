import { OrderStatus } from "@shared/domain/value-object/OrderStatus";
import { OutboxStatus } from "@shared/domain/value-object/OutboxStatus";
import { SagaStatus } from "@shared/domain/value-object/SagaStatus";


export class OrderPaymentOutboxMessage {
    private readonly id: string;
    private readonly sagaId: string;
    private readonly createdAt: Date;
    private readonly processedAt?: Date;
    private readonly type: string;
    private readonly payload: string;
    private readonly sagaStatus: SagaStatus;
    private readonly orderStatus: OrderStatus;
    private outboxStatus: OutboxStatus;
    private readonly version: number;

    constructor(
        id: string,
        sagaId: string,
        createdAt: Date,
        type: string,
        payload: string,
        sagaStatus: SagaStatus,
        orderStatus: OrderStatus,
        outboxStatus: OutboxStatus,
        version: number = 1,
        processedAt?: Date,

    ) {
        this.id = id;
        this.sagaId = sagaId;
        this.createdAt = createdAt;
        this.type = type;
        this.payload = payload;
        this.sagaStatus = sagaStatus;
        this.orderStatus = orderStatus;
        this.outboxStatus = outboxStatus;
        this.version = version;
        this.processedAt = processedAt;

    }
    getId(): string {
        return this.id;
    }
    getSagaId(): string {
        return this.sagaId;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getProcessedAt(): Date | undefined {
        return this.processedAt;
    }
    getType(): string {
        return this.type;
    }
    getPayload(): string {
        return this.payload;
    }
    getSagaStatus(): SagaStatus {
        return this.sagaStatus;
    }
    getOrderStatus(): OrderStatus {
        return this.orderStatus;
    }
    getOutboxStatus(): OutboxStatus {
        return this.outboxStatus;
    }
    getVersion(): number {
        return this.version;
    }

    setOutboxStatus(outboxStatus: OutboxStatus): void {
        this.outboxStatus = outboxStatus;
    }
}