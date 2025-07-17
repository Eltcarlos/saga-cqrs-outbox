import { OrderStatus } from "@shared/domain/value-object/OrderStatus";
import { OutboxStatus } from "@shared/domain/value-object/OutboxStatus";
import { SagaStatus } from "@shared/domain/value-object/SagaStatus";
import { Column, Entity, PrimaryColumn, VersionColumn } from "typeorm";

@Entity('payment_outbox')
export class PaymentOutboxEntity {

    @PrimaryColumn({ type: "uuid" })
    private readonly id: string;

    @Column({ type: "uuid" })
    private readonly sagaId: string;

    @Column()
    private readonly createdAt: Date;

    @Column({ nullable: true })
    private readonly processedAt?: Date;

    @Column()
    public readonly type: string;

    @Column()
    private readonly payload: string;

    @Column()
    public readonly sagaStatus: SagaStatus;

    @Column()
    public readonly orderStatus: OrderStatus;

    @Column()
    public readonly outboxStatus: OutboxStatus;

    @VersionColumn({ default: 1 })
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
}