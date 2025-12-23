import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateNewProductDto } from "./dto/create_new_product.dto";
import { UpdateProductDto } from "./dto/update_product_dto.dto";
import { LessThanOrEqual, Repository } from "typeorm";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>
    ) { }

    async getAllProduct(page: number) {
        return await this.productRepository.find({
            take: 20,
            skip: (page - 1) * 20,
        });
    }

    async getInfoProduct(id: number) {
        return await this.productRepository.findOneBy({ id: id });
    }

    async getInventory(page: number) {
        return await this.productRepository.find({
            take: 5,
            skip: (page - 1) * 5
        })
    }

    async getProductsLowStock(page: number) {
        return await this.productRepository.find({
            where: {
                stock: LessThanOrEqual(5)
            },
            order: {
                stock: 'ASC'
            },
            take: 5,
            skip: (page - 1) * 5,
        })
    }

    async addNewProduct(item: CreateNewProductDto) {
        return await this.productRepository.save(item);
    }

    async addManyProduct(items: CreateNewProductDto[]) {
        return await this.productRepository.save(items);
    }

    async updateProduct(id: number, item: UpdateProductDto) {
        const exist = await this.productRepository.findOneBy({ id: id });

        if (!exist) throw new NotFoundException("Not found this product");

        await this.productRepository.update(id, item);

        return {
            sucess: "Update success"
        }
    }

    async deleteProduct(id: number) {
        await this.productRepository.delete(id);
        return {
            sucess: "Delete success"
        }
    }
}