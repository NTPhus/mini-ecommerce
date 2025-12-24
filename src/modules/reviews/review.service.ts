import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { EntityManager, Repository } from "typeorm";
import { ReviewDTO } from "./dto/review.dto";
import { User } from "../users/entities/user.entity";
import { Product } from "../products/entities/product.entity";

@Injectable()
export class ReviewService {
    numItem = 10;
    constructor(
        @InjectRepository(Review) private readonly reviewReposity: Repository<Review>,
        private readonly entityManager: EntityManager
    ) { }

    async createReview(userId: number, dto: ReviewDTO) {
        const user = await this.entityManager.findOneBy(User, { id: userId });
        if (!user) throw new NotFoundException();

        const product = await this.entityManager.findOneBy(Product, { id: dto.productId });
        if (!product) throw new NotFoundException();

        const review = new Review()
        review.user = user;
        review.rating = dto.rating;
        review.comment = dto.comment;
        review.product = product;

        return this.reviewReposity.save(review);
    }

    async getReviews(productId: number, page: number) {
        return await this.reviewReposity.find({
            where: {
                product: { id: productId }
            }, take: this.numItem,
            skip: (page - 1) * this.numItem
        })
    }
}