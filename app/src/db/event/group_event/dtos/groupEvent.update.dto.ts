import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID, IsInt, ValidateNested, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGroupEventDTO {
    @IsOptional()
    @IsUUID()
    @ApiPropertyOptional({ description: 'Calendar associated with the event' })
    calendarId?: string;

    @IsOptional()
    @IsUUID()
    @ApiPropertyOptional({ description: 'User associated with the event' })
    userId?: string;

    @IsOptional()
    @IsUUID()
    @ApiPropertyOptional({ description: 'User calendar associated with the event' })
    userCalendarId?: string;

    @IsOptional()
    @IsUUID()
    @ApiPropertyOptional({ description: 'Author of the event' })
    author?: string;

    @IsOptional()
    @IsArray()
    @IsUUID( undefined, { each: true })
    @ApiPropertyOptional({ description: 'List of member IDs participating in the event', type: [String] })
    members?: string[];

    @IsOptional()
    @IsUUID()
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

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiPropertyOptional({ description: 'Start time of the event' })
    startAt?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiPropertyOptional({ description: 'End time of the event' })
    endAt?: Date;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({ description: 'Deactivation status of the event' })
    deactivatedAt?: boolean;
}