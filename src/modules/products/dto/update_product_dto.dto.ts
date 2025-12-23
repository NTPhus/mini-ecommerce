import { IsInt, IsNumber, IsString } from "class-validator";
import { ProductStatus } from "../entities/product.entity";

export class UpdateProductDto{
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsInt()
    stock:number;

    status?: ProductStatus
}