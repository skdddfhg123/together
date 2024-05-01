import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CalendarUpdateDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: 'Team Meeting', description: 'The title of the calendar' })
    title?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: 'public', description: 'Type of the calendar' })
    type?: string;
}
