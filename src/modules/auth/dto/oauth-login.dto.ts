import { IsEmail, IsString } from "class-validator";

export class OAuthLoginDto {
    @IsString()
    providerId: string;
    @IsString()
    provider: string;
    @IsEmail()
    email?: string;
}