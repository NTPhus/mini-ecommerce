import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ProductCategory } from "./product-category.entity";

@Entity()
@Index(["name"],{unique: true})
export class Category{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => Category)
    @JoinColumn({name: "parent_id"})
    parent: Category;

    @OneToMany(() => ProductCategory, (productCategory) => productCategory.category)
    productCategories: ProductCategory[];
}