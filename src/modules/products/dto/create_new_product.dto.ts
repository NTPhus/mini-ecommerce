import { IsArray, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNewProductDto{
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsInt()
    stock:number;

    @IsNumber({}, { each: true })
    @IsArray()
    @IsOptional()
    categories_id: number[]
}