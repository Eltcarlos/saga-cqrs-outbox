import { Restaurant } from "@order/domain/entity/Restaurant";
import { RestaurantEntity } from "@order/infrastructure/entity/Restaurant";
import { Product } from "@order/domain/entity/Product";
import { RestaurantNotFoundException } from "@order/domain/exception/RestaurantNotFoundException";
import { ProductId } from "@shared/domain/value-object/ProductId";
import { Money } from "@shared/domain/value-object/Money";
import { RestaurantId } from "@shared/domain/value-object/RestaurantId";
export class RestaurantDataAccessMapper {
    restaurantToRestaurantProducts(restaurant: Restaurant): string[] {
        return restaurant.getProducts().map(product => product.getId().getValue());
    }

    restaurantEntityToRestaurant(restaurantEntities: RestaurantEntity[]): Restaurant {
        const restaurantEntity = restaurantEntities[0];

        if (!restaurantEntity) {
            throw new RestaurantNotFoundException(`Restaurant could not be found.`, {
                cause: "Restaurant could not be found.",
                code: "RESTAURANT_NOT_FOUND"
            });
        }

        const restaurantProducts = restaurantEntities.map(entity =>
            new Product(
                new ProductId(entity.getProductId()),
                entity.getProductName(),
                new Money(entity.getProductPrice())
            )
        );

        return new Restaurant(
            new RestaurantId(restaurantEntity.restaurantId),
            restaurantProducts,
            restaurantEntity.isRestaurantActive()
        );
    }
}
