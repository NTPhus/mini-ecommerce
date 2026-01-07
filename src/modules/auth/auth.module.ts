import { UserModule } from './../users/users.module';
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController, OAuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { RefreshTokens } from "./entities/refresh-token.entity";
import { OAuth2Strategy } from "./oauth2.strategy";

@Module({
    imports: [TypeOrmModule.forFeature([User, RefreshTokens]), JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }), UserModule],
    controllers: [AuthController, OAuthController],
    providers: [AuthService, OAuth2Strategy]
})  
export class AuthModule {}
