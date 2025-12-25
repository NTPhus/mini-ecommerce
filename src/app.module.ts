import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/products/products.module';
import { CategoryModule } from './modules/categories/category.module';
import { OrderModule } from './modules/orders/order.module';
import { ReviewModule } from './modules/reviews/review.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CacheModule } from './modules/redis/cache.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  TypeOrmModule.forRoot({
    ...AppDataSource.options, autoLoadEntities: true, 
    entities: [],           
    synchronize: true,
  })
    , UserModule, AuthModule, ProductModule, CategoryModule, OrderModule, ReviewModule, CacheModule],
  providers: [{
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }, AppService],
  controllers: [AppController]
})
export class AppModule { }
