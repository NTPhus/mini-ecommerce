import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

export enum OrderStatus{
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled'
}

@Entity()
@Index(['user', 'status'])
export class Order{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.orders)
    @Index()
    user: User;

    @Column({default: OrderStatus.PENDING})
    status: OrderStatus;

    @Column()
    total_amount: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];
}