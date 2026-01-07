import { Module } from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm"
import { User } from "./entities/user.entity";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { CatsService } from "../cat.service";
import { CommonService } from "../common.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, CatsService, CommonService]
})  
export class UserModule {}
