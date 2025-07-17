import { Injectable } from "@nestjs/common";
import { CreateOrderCommandDTO } from "@order/application/dto/CreateOrderCommandDTO";
import { CreateOrderResponseDTO } from "@order/application/dto/CreateOrderResponseDTO";
import { OrderCreateCommandHandler } from "@order/application/OrderCreateCommandHandler";
import { OrderApplicationService } from "@order/application/ports/input/service/orderApplicationService";


@Injectable()
export class OrderApplicationServiceImpl implements OrderApplicationService {

    constructor(private readonly orderCreateCommandHandler: OrderCreateCommandHandler){}

    async createOrder(createOrderCommandDTO: CreateOrderCommandDTO): Promise<CreateOrderResponseDTO> {
        return await this.orderCreateCommandHandler.createOrder(createOrderCommandDTO);
    }
}