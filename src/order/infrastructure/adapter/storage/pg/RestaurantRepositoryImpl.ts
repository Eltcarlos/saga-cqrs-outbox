import { InjectRepository } from "@nestjs/typeorm";
import { RestaurantRepository } from "@order/application/ports/output/repository/RestaurantRepository";
import { Restaurant } from "@order/domain/entity/Restaurant";
import { In, Repository } from "typeorm";
import { RestaurantEntity } from "@order/infrastructure/entity/Restaurant";
import { RestaurantDataAccessMapper } from "@order/application/mapper/RestaurantDataAccessMapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RestaurantRepositoryImpl implements RestaurantRepository {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly repository: Repository<RestaurantEntity>,
    private readonly restaurantDataAccessMapper: RestaurantDataAccessMapper
  ) {}

  async findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | null> {
    const restaurantProducts = this.restaurantDataAccessMapper.restaurantToRestaurantProducts(restaurant);

    const restaurantEntities = await this.repository.find({
      where: {
        restaurantId: restaurant.getId().getValue(),
        productId: In(restaurantProducts),           
      },
    });

    if (!restaurantEntities.length) return null;

    return this.restaurantDataAccessMapper.restaurantEntityToRestaurant(restaurantEntities);
  }
}
