import { OrderStatus } from "@shared/domain/value-object/OrderStatus";
import { SagaStatus } from "@shared/domain/value-object/SagaStatus";


export class OrderSagaHelper {

    constructor() { }

    orderStatusToSagaStatus(orderStatus: OrderStatus): SagaStatus {
        switch (orderStatus) {
            case OrderStatus.PAID:
                return SagaStatus.PROCESSING;
            case OrderStatus.APPROVED:
                return SagaStatus.SUCCEEDED;
            case OrderStatus.CANCELLING:
                return SagaStatus.COMPENSATING;
            case OrderStatus.CANCELLED:
                return SagaStatus.COMPENSATED;
            default:
                return SagaStatus.STARTED;
        }
    }

}