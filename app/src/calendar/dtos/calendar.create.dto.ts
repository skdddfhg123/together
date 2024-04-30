import { PickType } from "@nestjs/swagger";
import { CalendarEntity } from "../entities/calendar.entity";
import { IsString } from "class-validator";

export class CalendarCreateDto extends PickType(CalendarEntity, [
    'title',
    'type',
]as const) {
    
    @IsString()
    attendees: string[];
}