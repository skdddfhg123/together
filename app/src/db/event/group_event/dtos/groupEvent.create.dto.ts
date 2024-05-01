import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";
import { CreateDateColumn } from "typeorm";

export class CreateGroupEventDTO {
    @ApiProperty({
        description: 'Title of the event',
        example: 'Team Meeting',
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Color of the event',
        example: 'Blue',
    })
    @IsString()
    color: string;

    
    @ApiProperty({
        description: 'Start date and time of the event',
        type: 'string',
        format: 'date-time',
        example: '2024-04-30T09:00:00Z',
    })
    @IsDate()
    @Type(() => Date)
    startAt: Date;


    @ApiProperty({
        description: 'End date and time of the event',
        type: 'string',
        format: 'date-time',
        example: '2024-04-30T11:00:00Z',
    })
    @IsDate()
    @Type(() => Date)
    endAt: Date;

    @ApiProperty({
        description: 'Array of emails for participants',
        example: ['user1@example.com', 'user2@example.com'],
        isArray: true,
    })
    @IsArray()
    @IsString({ each: true })
    emails: string[];
}
