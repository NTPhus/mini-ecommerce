import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import type { Request } from "express";
import { OrderDto } from "./dto/order.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { User } from "../users/entities/user.entity";

@Controller("order")
@UseGuards(AuthGuard)
export class OrderController{
    constructor(
        private readonly orderService: OrderService
    ){}

    @Get()
    getAllOrder(@Query('page') page: number = 1){
        return this.orderService.getAllOrder(page);
    }

    @Get('history')
    getHistory(@CurrentUser() user: User, @Query('page') page: number = 1){
        return this.orderService.getHistory(user.id, page);
    }

    @Get('detail/:id')
    getDetail(@Param('id') orderId: number){
        return this.orderService.getDetail(orderId);
    }

    @Post('update-status')
    updateStatus(@Body() dto: UpdateStatusDto[]){
        return this.orderService.updateStatus(dto);
    }

    @Post()
    createOrder(@CurrentUser() user: User, @Body() dto: OrderDto[]){
        return this.orderService.createOrder(user.id, dto);
    }
}