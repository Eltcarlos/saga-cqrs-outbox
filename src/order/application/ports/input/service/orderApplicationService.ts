import { CreateOrderCommandDTO } from "../../../dto/CreateOrderCommandDTO";
import { CreateOrderResponseDTO } from "../../../dto/CreateOrderResponseDTO";

export abstract class OrderApplicationService {
    abstract createOrder(createOrderCommandDTO: CreateOrderCommandDTO): Promise<CreateOrderResponseDTO>;
}