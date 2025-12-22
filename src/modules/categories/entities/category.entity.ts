import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ProductCategory } from "./product-category";

@Entity()
@Index(["name"],{unique: true})
export class Category{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => Category)
    @JoinColumn()
    parent_id: number;

    @OneToMany(() => ProductCategory, (productCategory) => productCategory.category)
    productCategories: ProductCategory[];
}