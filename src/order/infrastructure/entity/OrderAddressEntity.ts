import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { OrderEntity } from "./Order";

@Entity('order_address')
export class OrderAddressEntity {

  @PrimaryColumn({ type: "uuid" })
  id: string;

  @OneToOne(() => OrderEntity, order => order.address)
  @JoinColumn({ name: "ORDER_ID" })
  order: OrderEntity;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  equals(other: OrderAddressEntity): boolean {
    return this.id === other.id;
  }
}
