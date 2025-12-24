import { Product } from "../../products/entities/product.entity";
import { Entity, Index,  ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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