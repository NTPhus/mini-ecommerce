import { IsEmail, IsString } from "class-validator";

export class OAuthLoginDto {
    @IsString()
    oauthId: string;
    @IsString()
    provider: string;
    @IsEmail()
    email?: string;
}