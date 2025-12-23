import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from "@nestjs/common";
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService{
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    ){}

    async addCategory(){
        
    }
}