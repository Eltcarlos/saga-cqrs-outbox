import { Restaurant } from "@order/domain/entity/Restaurant";

export abstract class RestaurantRepository {
    abstract findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | null>;
}
