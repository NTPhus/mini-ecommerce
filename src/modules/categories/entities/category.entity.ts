import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ProductCategory } from "./product-category.entity";

@Entity()
@Index(["name"],{unique: true})
export class Category{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category, (category) => category.children)
    @JoinColumn({name: "parent_id"})
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @OneToMany(() => ProductCategory, (productCategory) => productCategory.category)
    productCategories: ProductCategory[];
}