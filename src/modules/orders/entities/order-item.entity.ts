import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "../../products/entities/product.entity";

@Entity()
export class OrderItem{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.orderItems)
    order: Order;

    @ManyToOne(() => Product, (product) => product.orderItems)
    product: Product;

    @Column()
    quantity: number;

    @Column()
    priceSnapshot: number;
}