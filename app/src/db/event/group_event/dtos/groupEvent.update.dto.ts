import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID, IsInt, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGroupEventDTO {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'User associated with the event' })
    userId?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'User calendar associated with the event' })
    userCalendarId?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'Author of the event' })
    author?: string;

    @IsOptional()
    @ApiPropertyOptional({ description: 'List of member IDs participating in the event', type: [String] })
    member?: string[];

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'Group associated with the event' })
    group?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'Title of the event' })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'Color of the event' })
    color?: string;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({ description: 'Pin status of the event' })
    pinned?: boolean;

    @IsOptional()
    @IsInt()
    @ApiPropertyOptional({ description: 'Number of alerts for the event' })
    alerts?: number;

    @IsOptional()
    @ApiPropertyOptional({ description: 'Attachment for the event', type: 'object' })
    attachment?: any;
}