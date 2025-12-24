import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { User } from "../users/entities/user.entity";
import { OrderItem } from "./entities/order-item.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Order, User, OrderItem])],
    controllers: [OrderController],
    providers: [OrderService]
})  
export class OrderModule {}
