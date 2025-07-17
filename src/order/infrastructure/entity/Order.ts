import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { OrderAddressEntity } from "./OrderAddressEntity";
import { OrderStatus } from "@shared/domain/value-object/OrderStatus";
import { OrderItemEntity } from "./OrderItemEntity";

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  customerId: string;

  @Column({ type: "uuid" })
  restaurantId: string;

  @Column({ type: "uuid" })
  trackingId: string;

  @Column({ type: "decimal" })
  price: number;

  @Column({ type: "varchar" })
  orderStatus: OrderStatus;

  @Column({ type: "text", nullable: true })
  failureMessages: string;

  @OneToOne(() => OrderAddressEntity, address => address.order, {
    cascade: true,
    eager: true
  })
  address: OrderAddressEntity;

  @OneToMany(() => OrderItemEntity, item => item.order, {
    cascade: true, // cascade operations to persist, remove, etc. items with the order
    eager: true // eager loading to fetch items with the order
  })
  items: OrderItemEntity[];
}
