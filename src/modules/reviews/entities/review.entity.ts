import { Product } from "src/modules/products/entities/product.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}