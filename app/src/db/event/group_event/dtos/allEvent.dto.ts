import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";


export class AllEventDTO {
    @ApiProperty({
        description: 'Title of the event',
        example: 'Team Meeting',
    })
    @IsString()
    title?: string;

    @ApiProperty({
        description: 'Type of the event',
        example: 'kakao',
    })
    social?: string;

    @ApiProperty({
        description: 'Color of the event',
        example: 'Blue',
    })
    @IsString()
    color?: string;

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
