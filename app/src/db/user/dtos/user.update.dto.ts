import { IsString, IsOptional, IsBoolean, IsEmail, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UserUpdateDto {
    @IsEmail()
    @IsOptional()
    useremail?: string;

    @IsString()
    @IsOptional()
    nickname?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    birthDay?: Date | null;

    @IsBoolean()
    @IsOptional()
    birthDayFlag?: boolean;
}