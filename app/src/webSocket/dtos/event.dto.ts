import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EventDto {
    @IsString()
    @IsNotEmpty()
    userEmail: string;

    @IsString()
    @IsNotEmpty()
    calendarId?: string;

    @IsString()
    @IsOptional()
    message?: string;
}