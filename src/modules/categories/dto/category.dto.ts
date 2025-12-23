import { IsNumber, IsOptional, IsString } from "class-validator";

export class CategoryDTO{
    @IsString()
    name: string;

    @IsNumber()
    @IsOptional()
    parentId?: number;
}