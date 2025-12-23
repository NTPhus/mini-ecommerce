import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/products/products.module';
import { CategoryModule } from './modules/categories/category.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  TypeOrmModule.forRoot(AppDataSource.options)
    , UserModule, AuthModule, ProductModule, CategoryModule],

  providers: [{
    provide: APP_PIPE,
    useClass: ValidationPipe,
  }]
})
export class AppModule { }
