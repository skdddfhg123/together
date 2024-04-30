import { PickType } from "@nestjs/swagger";
import { Calendar } from "../entities/calendar.entity";
import { IsString } from "class-validator";

export class CalendarCreateDto extends PickType(Calendar, [
    'title',
    'type',
]as const) {
    
    @IsString()
    attendees: string[];
}