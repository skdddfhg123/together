import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";
import { CreateDateColumn } from "typeorm";

export class CreateGroupEventDTO {

    /*
    @ApiPropertyOptional({
        description: 'List of member UUIDs participating in the event',
        type: [String],
        example: ['123e4567-e89b-12d3-a456-426614174000'],
    })
    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true }) 
    members?: string[];
    */

    @ApiProperty({
        description: 'UUID of the group associated with the event',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    group: string;

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

}
