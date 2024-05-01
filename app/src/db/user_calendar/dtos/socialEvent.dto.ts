import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SocialEventDto {
    @ApiProperty({
        description: 'External Platform Name',
        example: 'Google'
    })
    @IsNotEmpty()
    @IsString()
    social: string;

    @ApiProperty({
        description: 'Scedule Title',
        example: '벚꽃 구경',
    })
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Schedule Start Time',
        example: '2023-01-03T00:00:00.000Z'
    })
    @IsNotEmpty()
    @IsDate()
    startAt: Date;

    @ApiProperty({
        description: 'Schedule End Time',
        example: '2023-01-03T00:00:00.000Z'
    })
    @IsNotEmpty()
    @IsDate()
    endAt: Date;
}