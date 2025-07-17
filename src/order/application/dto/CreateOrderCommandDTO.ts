import { ArrayMinSize, IsArray, IsNotEmpty, IsNotEmptyObject, IsObject, IsUUID, ValidateNested } from "class-validator";
import { OrderItemDTO } from "./OrderItemDTO";
import { OrderAddressDTO } from "./OrderAddressDTO";
import { Type } from 'class-transformer';

export class CreateOrderCommandDTO {
    @IsNotEmpty()
    @IsUUID()
    restaurantId: string;

    @IsNotEmpty()
    @IsUUID()
    customerId: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one order item is required' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDTO)
    items: OrderItemDTO[];

    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => OrderAddressDTO)
    address: OrderAddressDTO;
}