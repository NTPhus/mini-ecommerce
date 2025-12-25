import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateNewProductDto } from "./dto/create_new_product.dto";
import { UpdateProductDto } from "./dto/update_product_dto.dto";
import { EntityManager, In, LessThanOrEqual, Repository } from "typeorm";
import { ProductCategory } from "../categories/entities/product-category.entity";
import { Category } from '../categories/entities/category.entity';
import { CacheService } from "../redis/cache.service";

@Injectable()
export class ProductService {
    numItem = 10;
    minStock = 5;
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        private readonly entityManager: EntityManager,
        private readonly cacheService: CacheService
    ) { }

    async getAllProduct(page: number) {
        const cached = this.cacheService.get(`productList: ${page}`)
        if(cached) return cached
        const productList = await this.productRepository.find({
            take: this.numItem,
            skip: (page - 1) * this.numItem,
        });
        if(productList.length > 0){
            this.cacheService.set(`productList: ${page}`, productList, 120)
        }
        return productList;
    }

    async getInfoProduct(id: number) {
        const cached = this.cacheService.get(`productId:${id}`);
        if(cached) return cached;

        const product = await this.productRepository.findOneBy({ id: id });
        if(product)
            this.cacheService.set(`productId:${id}`, product, 120);

        return product
    }

    async getInventory(page: number) {
        return await this.productRepository.find({
            take: this.numItem,
            skip: (page - 1) * this.numItem
        })
    }

    async getProductsLowStock(page: number) {
        return await this.productRepository.find({
            where: {
                stock: LessThanOrEqual(this.minStock)
            },
            order: {
                stock: 'ASC'
            },
            take: this.numItem,
            skip: (page - 1) * this.numItem,
        })
    }

    async addNewProduct(item: CreateNewProductDto) {
        const product = this.entityManager.create(Product, {
            name: item.name,
            price: item.price,
            stock: item.stock,
            description: item.description,
        })

        await this.entityManager.save(product);

        const categories = await this.categoryRepository.findBy({
            id: In(item.categories_id)
        })

        if(categories.length != item.categories_id.length) throw new BadRequestException("Invalid category id");

        const productCategories = categories.map(category => {
            const pc = new ProductCategory();
            pc.product = product;
            pc.category = category;
            return pc;
        })
        
        await this.entityManager.save(ProductCategory, productCategories)

        return product;
    }

    async addManyProduct(items: CreateNewProductDto[]) {
        return await this.productRepository.save(items);
    }

    async updateProduct(id: number, item: UpdateProductDto) {
        const exist = await this.productRepository.findOneBy({ id: id });

        if (!exist) throw new NotFoundException("Not found this product");

        await this.productRepository.update(id, item);
        this.cacheService.del(`productId:${id}`)
        return {
            sucess: "Update success"
        }
    }

    async updateProductCategory(id: number, categories_id: number[]){
        const product = await this.productRepository.findOneBy({id: id});
        if(!product) throw new BadRequestException("Invalid product id");

        const categories = await this.categoryRepository.findBy({
            id: In(categories_id)
        })
        if(categories.length != categories_id.length) throw new BadRequestException("Invalid category id")

        const productCategory = categories.map(item => {
            const pc = new ProductCategory();
            pc.category = item;
            pc.product = product;
            return pc;
        })

        await this.entityManager.save(ProductCategory, productCategory)
    }

    async deleteProduct(id: number) {
        await this.productRepository.delete(id);
        return {
            sucess: "Delete success"
        }
    }
}