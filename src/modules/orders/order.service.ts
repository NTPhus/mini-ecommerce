import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { EntityManager, In, Repository } from "typeorm";
import { OrderItemDto } from "./dto/order.dto";
import { User } from "../users/entities/user.entity";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { OrderItem } from "./entities/order-item.entity";
import { Product } from "../products/entities/product.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItemReposity: Repository<OrderItem>,
        private readonly entityManager: EntityManager
    ) { }

    async getAllOrder(page: number, numItem: number) {
        const orderList = await this.orderRepository.find({
            take: numItem,
            skip: (page - 1) * numItem
        })
        return orderList;
    }

    async getUserOrder(userId: number, page: number, numItem : number) {
        return await this.orderRepository.find({
            where: {
                user: { id: userId }
            },
            take: numItem,
            skip: (page - 1) * numItem
        })
    }

    async getListOrderItems(orderId: number) {
        const result = await this.orderItemReposity.find({
            where: {
                order: { id: orderId },
            },
            relations: {
                product: true
            },
            select: {
                id: true,
                product: {
                    id: true,
                    name: true
                },
                quantity: true,
                priceSnapshot: true
            }
        })
        return result;
    }

    async createOrder(userId: number, OrderitemDto: OrderItemDto[]) {
        return await this.entityManager.transaction(async (em) => {
            const userExist = await this.entityManager.findOneBy(User, { id: userId });
            if (!userExist) throw new NotFoundException("Invalid user id");

            const productIds = OrderitemDto.map(item => item.productId);
            const products = await this.entityManager.findBy(Product, {
                id: In(productIds)
            })

            if (products.length != productIds.length) throw new NotFoundException("One or more products not found");

            const productMap = new Map(products.map(p => [p.id, p]));
            const orderItems: OrderItem[] = [];
            let totalAmount = 0;

            const order = new Order();
            order.user = userExist;
            order.total_amount = 0;

            for (const item of OrderitemDto) {
                const product = productMap.get(item.productId);
                if (!product) throw new NotFoundException(`Not found product id: ${item.productId}`)
                
                if(item.quantity < 0) throw new BadRequestException("Quantiy must greater than zero");

                const oi = new OrderItem();
                oi.product = product;
                oi.quantity = item.quantity;
                oi.priceSnapshot = product.price;
                oi.order = order;
                totalAmount += product.price * item.quantity;
                orderItems.push(oi);
            };

            order.total_amount = totalAmount

            await this.entityManager.save(Order, order);
            await this.entityManager.save(OrderItem, orderItems)

            const { user, ...orderWithoutUser } = order;
            const returnItem = orderItems.map(({order, ...rest}) => rest);

            return ({ ...orderWithoutUser, items: returnItem })
        })
    }

    async updateStatus(dto: UpdateStatusDto[]) {
        this.orderRepository.save(dto);
    }

    async deleteOrder(orderId: number){
        const orderItems = await this.getListOrderItems(orderId);
        await this.orderItemReposity.remove(orderItems);
        return await this.orderRepository.delete(orderId);
    }
}
