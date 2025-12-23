import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { RefreshTokens } from "./entities/refresh-token.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, RefreshTokens]), JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),],
    controllers: [AuthController],
    providers: [AuthService]
})  
export class AuthModule {}
