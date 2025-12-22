import { Product } from "src/modules/products/entities/product.entity";
import { Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./category.entity";

@Entity()
@Index(["product_id", "category_id"])
export class ProductCategory{
    @ManyToOne(() => Product, (product) => product.productCategories)
    product: Product;

    @ManyToOne(() => Category, (category) => category.productCategories)
    category: Category;
}