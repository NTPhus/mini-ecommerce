import { Review } from './../../reviews/entities/review.entity';
import { ProductCategory } from "src/modules/categories/entities/product-category.entity";
import { OrderItem } from "src/modules/orders/entities/order-item.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum ProductStatus{
    ACTIVE = 'active',
    DRAFT = 'draft'
}

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column()
    status: ProductStatus;

    @Column({
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP'
    })
    created_at: Date;

    @OneToMany(() => ProductCategory, (productCategory) => productCategory.product)
    productCategories: ProductCategory[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];
}