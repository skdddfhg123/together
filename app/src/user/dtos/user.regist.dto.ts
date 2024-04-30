import { PickType } from "@nestjs/swagger";
import { UserEntity } from "../utils/entities/user.entity";
import { IsNotEmpty, IsString } from "class-validator";

export class UserRegistDto extends PickType(UserEntity, [
    'email',
    'nickname',
] as const){
    @IsString()
    @IsNotEmpty()
    password: string;
}