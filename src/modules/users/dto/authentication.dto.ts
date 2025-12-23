import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthenticationDTO{
    @IsEmail({}, {message: "This is not an email!"})
    email: string;

    @IsString()
    @MinLength(6, {
        message:"This password too short!"
    })
    password: string;
}