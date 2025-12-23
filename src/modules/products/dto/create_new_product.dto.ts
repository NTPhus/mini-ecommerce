import { IsInt, IsNumber, IsString } from "class-validator";

export class CreateNewProductDto{
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsInt()
    stock:number;
}