import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDTO } from "./dto/category.dto";

@Controller('category')
export class CategoryController{
    constructor(
        private readonly categoryService: CategoryService
    ){}

    @Get()
    getAllCategory(@Query('page') page: number = 1, @Query('numItem') numItem: number = 10){
        return this.categoryService.getAllCategory(page, numItem);
    }

    @Post()
    addCategory(@Body() item: CategoryDTO){
        return this.categoryService.addCategory(item.name, item.parentId);
    }

    @Post("assign-parent-to-children/:id")
    assignParentToChildren(@Param("id") id: number, @Body() childrenId: number[]){
        console.log(childrenId);
        return this.categoryService.assignChildrenToParent(id, childrenId);
    }

    @Post("add-many")
    addManyCategory(@Body() items: CategoryDTO[]){
        return this.categoryService.addManyCategory(items);
    }

    @Get(":id")
    getCategory(@Param("id") id: number){
        return this.categoryService.getCategory(id);
    }

    @Patch(":id")
    updateCategory(@Param("id") id: number, @Body() item: CategoryDTO){
        return this.categoryService.updateCategory(id, item.name)
    }

    @Delete(":id")
    deleteCategory(@Param("id") id: number){
        return this.categoryService.deleteCategory(id);
    }
}
