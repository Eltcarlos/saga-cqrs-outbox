import { Body, Controller, Post } from "@nestjs/common";
import { CreateOrderCommandDTO } from "@order/application/dto/CreateOrderCommandDTO";
import { OrderApplicationService } from "@order/application/ports/input/service/orderApplicationService";


@Controller('orders')
export class OrderController {

    constructor(private readonly orderApplicationService: OrderApplicationService){}

    @Post()
    async createOrder(@Body() createOrderCommandDTO: CreateOrderCommandDTO) {
       return await this.orderApplicationService.createOrder(createOrderCommandDTO)
    }
}