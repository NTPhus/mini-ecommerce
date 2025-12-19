import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

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
}