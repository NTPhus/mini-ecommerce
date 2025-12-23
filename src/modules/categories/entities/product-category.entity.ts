import { Product } from "src/modules/products/entities/product.entity";
import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity()
@Index(["product", "category"])
export class ProductCategory{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.productCategories)
    product: Product;

    @ManyToOne(() => Category, (category) => category.productCategories)
    category: Category;
}