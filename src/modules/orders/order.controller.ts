import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import type { Request } from "express";
import { OrderItemDto } from "./dto/order.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { User } from "../users/entities/user.entity";
import { iterator } from "rxjs/internal/symbol/iterator";

@Controller("order")
@UseGuards(AuthGuard)
export class OrderController{
    constructor(
        private readonly orderService: OrderService
    ){}

    @Get()
    getAllOrder(@Query("page") page: number = 1, @Query("numItem") numItem:number = 10){
        return this.orderService.getAllOrder(page, numItem);
    }

    @Get('history')
    getHistory(@CurrentUser() user: User, @Query("page") page: number = 1, @Query("numItem") numItem:number = 10){
        return this.orderService.getUserOrder(user.id, page, numItem);
    }

    @Get('detail/:id')
    getDetail(@Param('id') orderId: number){
        return this.orderService.getListOrderItems(orderId);
    }

    @Patch('update-status')
    updateStatus(@Body() dto: UpdateStatusDto[]){
        return this.orderService.updateStatus(dto);
    }

    @Post()
    createOrder(@CurrentUser() user: User, @Body() dto: OrderItemDto[]){
        return this.orderService.createOrder(user.id, dto);
    }

    @Delete(":id")
    deleteOrder(@Param('id') orderId){
        return this.orderService.deleteOrder(orderId);
    }
}