import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { ProductCategory } from "./entities/product-category.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Category, ProductCategory])],
    controllers: [CategoryController],
    providers: [CategoryService]
})  
export class CategoryModule {}