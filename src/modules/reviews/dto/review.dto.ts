import { IsNumber, IsString } from "class-validator";

export class ReviewDTO{
    @IsNumber()
    productId: number;

    @IsNumber()
    rating: number;

    @IsString()
    comment: string;
}