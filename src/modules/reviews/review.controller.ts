import { CurrentUser } from '../../common/decorators/user.decorator';
import { ReviewService } from './review.service';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { User } from '../users/entities/user.entity';
import { ReviewDTO } from './dto/review.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('reviews')
@UseGuards(AuthGuard)
export class ReviewController{
    constructor(private readonly reviewService: ReviewService){}

    @Post()
    createReview(@CurrentUser() user: User, @Body() dto: ReviewDTO){
        return this.reviewService.createReview(user.id, dto);
    }

    @Get()
    getReviews(@Query('id') productId: number, @Query('page') page: number = 1){
        return this.reviewService.getReviews(productId, page);
    }
}