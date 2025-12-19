import { Product } from "src/modules/products/entities/product.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
@Index(["product_id", "user_id"])
export class ProductCategory{
    @ManyToOne(() => Product, (product) => product.productCategories)
    product: Product;

    @ManyToOne(() => User, (user) => user.productCategories)
    user: User;
}