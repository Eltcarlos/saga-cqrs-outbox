import { IsNotEmpty, IsUUID } from "class-validator";

export class OrderItemDTO {
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @IsNotEmpty()
    quantity: number;
    
    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    subtotal: number;
}