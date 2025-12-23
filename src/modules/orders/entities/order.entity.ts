import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
    user: User;

    @Column()
    status: OrderStatus;

    @Column()
    total_amout: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];
}