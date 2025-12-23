import { RefreshTokens } from "src/modules/auth/entities/refresh-token.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Review } from "src/modules/reviews/entities/review.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole{
    ADMIN = 'admin',
    USER = 'user'
}

export enum UserStatus{
    ACTIVE = 'active',
    BLOCKED = 'blocked'
}

@Entity()
@Index(['email'])
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({default: UserStatus.ACTIVE})
    status: UserStatus;

    @Column({default: UserRole.USER})
    role: UserRole;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date

    @OneToMany(() => RefreshTokens, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshTokens[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];
}