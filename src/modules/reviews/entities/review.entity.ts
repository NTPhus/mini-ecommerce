import { Product } from "src/modules/products/entities/product.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.reviews)
    user: User;

    @ManyToOne(() => Product, (product) => product.reviews)
    product: Product;

    @Column()
    rating: string;

    @Column()
    comment: string;

    @Column({
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP'
    })
    created_at: Date;
}