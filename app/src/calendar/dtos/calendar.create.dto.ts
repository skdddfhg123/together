import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CalendarCreateDto {
    @IsString()
    @ApiProperty({ example: 'Team Meeting', description: 'The title of the calendar' })
    title: string;

    @IsString()
    @ApiProperty({ example: 'public', description: 'Type of the calendar', required: false })
    type: string;
}
