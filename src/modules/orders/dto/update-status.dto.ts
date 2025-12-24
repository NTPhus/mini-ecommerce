import { IsEnum, IsNumber } from "class-validator";
import { OrderStatus } from "../entities/order.entity";

export class UpdateStatusDto{
    @IsNumber()
    id: number;

    @IsEnum(OrderStatus)
    status: OrderStatus;
}