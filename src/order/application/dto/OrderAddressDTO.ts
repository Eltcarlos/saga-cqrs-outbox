import { IsNotEmpty } from "class-validator";

export class OrderAddressDTO {
    @IsNotEmpty()
    street: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    postalCode: string;
}