import { CreateNewProductDto } from './dto/create_new_product.dto';
import { UpdateProductDto } from './dto/update_product_dto.dto';
import { ProductService } from './products.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";

@Controller("products")
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Get()
    getAllProduct(@Query("page") page: number = 1, @Query("numItem") numItem:number = 10){
        const pageNumber = Number(page) || 1;
        const safePage = pageNumber < 1 ? 1 : pageNumber;
        return this.productService.getAllProduct(safePage, numItem)
    }

    @Get("inventory")
    getInventory(@Query("page") page: number = 1, @Query("numItem") numItem:number = 10) {
        const pageNumber = Number(page) || 1;
        const safePage = pageNumber < 1 ? 1 : pageNumber;
        return this.productService.getInventory(safePage, numItem);
    }

    @Get("low-stock")
    getProductLowStock(@Query("page") page: number = 1, @Query("numItem") numItem:number = 10) {
        const pageNumber = Number(page) || 1;
        const safePage = pageNumber < 1 ? 1 : pageNumber;
        return this.productService.getProductsLowStock(safePage, numItem);
    }

    @Post("add")
    addProduct(@Body() newProductDto: CreateNewProductDto) {
        return this.productService.addNewProduct(newProductDto);
    }

    @Post("add-many")
    addManyProduct(@Body() NewProductsDto: CreateNewProductDto[]) {
        return this.productService.addManyProduct(NewProductsDto);
    }

    @Patch("update-category/:id")
    updateProductCategory(@Param("id") id: number, @Body() category_id: number[]){
        return this.productService.updateProductCategory(id, category_id);
    }

    @Patch(":id")
    updateProduct(@Param('id') id: number, @Body() ProductDto: UpdateProductDto) {
        return this.productService.updateProduct(id, ProductDto);
    }

    @Get(":id")
    getInfoProduct(@Param("id") id: number) {
        return this.productService.getInfoProduct(id);
    }

    @Delete(":id")
    deleteProduct(@Param("id") id: number) {
        return this.productService.deleteProduct(id);
    }
}