import { RefreshTokens } from "../../auth/entities/refresh-token.entity";
import { Order } from "../../orders/entities/order.entity";
import { Review } from "../../reviews/entities/review.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

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
@Unique(['provider', 'providerId'])
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ nullable: true })
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

    @Column({ default: 'local' })
    provider: string;

    @Column({ name: 'provider_id', nullable: true })
    providerId: string;
}