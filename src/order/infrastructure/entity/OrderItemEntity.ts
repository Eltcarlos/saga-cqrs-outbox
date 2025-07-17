import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn
} from "typeorm";
import { OrderEntity } from "./Order";

@Entity("order_items")
export class OrderItemEntity {
  @PrimaryColumn({ type: "bigint" })
  id: number;

  @ManyToOne(() => OrderEntity, order => order.items, {
    eager: false,
  })
  @JoinColumn({ name: "ORDER_ID" }) // foreign key column
  order: OrderEntity;

  @Column({ type: "uuid" })
  productId: string;

  @Column({ type: "decimal" })
  price: number;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "decimal" })
  subTotal: number;
}
