import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from "@nestjs/common";
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    ) { }

    async addCategory(name: string, parent_id?: number) {
        const category = new Category();
        category.name = name;
        if (parent_id) {
            const existParent = await this.categoryRepository.findOneBy({ id: parent_id });
            if (existParent) category.parent = existParent;
        }
        return await this.categoryRepository.save(category);
    }

    async addManyCategory(items: CategoryDTO[]) {
        items = items.map(item => {
            const category = new Category();
            category.name = item.name;
            if (item.parentId) {
                category.parent = {
                    id: item.parentId
                } as Category;
            }
            return category;
        })
        
        return this.categoryRepository.save(items);
    }

    async assignChildrenToParent(parentId: number, childrenId: number[]) {
        const parent = await this.categoryRepository.findOneBy({ id: parentId });
        if (!parent) throw new NotFoundException();

        const updatedChildren = childrenId.map(id => ({
            id: id,
            parent: parent
        }))

        return this.categoryRepository.save(updatedChildren);
    }

    async getCategory(id: number){
        return this.categoryRepository.findOneBy({id: id});
    }

    async getAllCategory(page: number, numItem: number) {
        return this.categoryRepository.find({
            take: numItem,
            skip: (page - 1) * numItem
        })
    }

    async updateCategory(id: number, name: string) {
        return this.categoryRepository.update(id, { name: name });
    }

    async deleteCategory(id: number) {
        const category = await this.categoryRepository.findOneBy({id: id});
        if(!category) throw new NotFoundException();
        
        if(category.children && category.children.length > 0) throw new Error("This category have many category children")
        return this.categoryRepository.delete(id);
    }
}