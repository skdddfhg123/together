import { ApiProperty, PickType } from "@nestjs/swagger";
import { Calendar } from "../entities/calendar.entity";
import { IsString } from "class-validator";

// export class CalendarCreateDto extends PickType(Calendar, [
//     'title',
//     'type',
// ]as const) {
    
//     // @IsString()
//     // attendees: string[];
// }

export class CalendarCreateDto {
    @IsString()
    @ApiProperty({ example: 'Team Meeting', description: 'The title of the calendar' })
    title: string;

    @IsString()
    @ApiProperty({ example: 'public', description: 'Type of the calendar', required: false })
    type: string;
    // @IsString()
    // attendees: string[];
}
