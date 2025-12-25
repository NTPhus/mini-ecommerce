import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductController } from "./products.controller";
import { ProductService } from "./products.service";
import { Category } from "../categories/entities/category.entity";
import { CacheService } from "../redis/cache.service";


@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, CacheService])],
    controllers: [ProductController],
    providers: [ProductService]
})  
export class ProductModule {}
