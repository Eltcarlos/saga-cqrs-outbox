import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('order_restaurant_m_view')
export class RestaurantEntity {

    @PrimaryColumn({
        type: "uuid",
    })
    public readonly restaurantId: string;

    @Column({
        type: "uuid",
    })
    public readonly productId: string;

    @Column()
    private readonly restaurantName: string;

    @Column()
    private readonly restaurantActive: boolean;
    
    @Column()
    private readonly productName: string;

    @Column()
    private readonly productPrice: number;

    @Column()
    private readonly productAvailable: boolean;

    constructor(
        restaurantId: string,
        productId: string,
        restaurantName: string,
        restaurantActive: boolean,
        productName: string,
        productPrice: number,
        productAvailable: boolean
    ) {
        this.restaurantId = restaurantId;
        this.productId = productId;
        this.restaurantName = restaurantName;
        this.restaurantActive = restaurantActive;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productAvailable = productAvailable;
    }
    
    getRestaurantId(): string {
        return this.restaurantId;
    }

    getProductId(): string {
        return this.productId;
    }

    getRestaurantName(): string {
        return this.restaurantName;
    }

    isRestaurantActive(): boolean {
        return this.restaurantActive;
    }

    getProductName(): string {
        return this.productName;
    }

    getProductPrice(): number {
        return this.productPrice;
    }

    isProductAvailable(): boolean {
        return this.productAvailable;
    }

}