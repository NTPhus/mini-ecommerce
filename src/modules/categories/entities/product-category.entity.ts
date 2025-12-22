import { Product } from "src/modules/products/entities/product.entity";
import { Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Category } from "./category.entity";

@Entity()
@Index(["product_id", "category_id"])
export class ProductCategory{
    @ManyToOne(() => Product, (product) => product.productCategories)
    @JoinColumn({name: "product_id"})
    product: Product;

    @ManyToOne(() => Category, (category) => category.productCategories)
    @JoinColumn({name: "category_id"})
    category: Category;
}