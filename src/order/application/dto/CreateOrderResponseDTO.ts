import { OrderStatus } from "@shared/domain/value-object/OrderStatus";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateOrderResponseDTO {
    @IsNotEmpty()
    @IsUUID()
    orderTrackingId: string;

    @IsNotEmpty()
    orderStatus: OrderStatus;

    @IsNotEmpty()
    message: string;

    constructor(orderTrackingId: string, orderStatus: OrderStatus, message: string) {
        this.orderTrackingId = orderTrackingId;
        this.orderStatus = orderStatus;
        this.message = message;
    }
}