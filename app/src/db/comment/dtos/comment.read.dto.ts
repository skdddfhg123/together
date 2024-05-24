import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsString } from "class-validator";


export class ReadFeedCommentDTO {

    @ApiProperty({
        description: 'Id of the Feed',
        example: 'Team Meeting in Cafe',
    })
    @IsString()
    feedCommentId: string;

    @ApiProperty({
        description: 'content written in Feed',
        example: 'Today, we ........... ',
    })
    @IsString()
    content: string;

    @ApiProperty({
        description: 'content written in Feed',
        example: 'Today, we ........... ',
    })
    @IsDateString()
    createdAt: Date;

    @ApiProperty({
        description: 'content written in Feed',
        example: 'Today, we ........... ',
    })
    @IsDateString()
    updatedAt: Date;

    @ApiProperty({
        description: 'content written in Feed',
        example: 'Today, we ........... ',
    })
    @IsString()
    nickname: string;

    @ApiProperty({
        description: 'content written in Feed',
        example: 'Today, we ........... ',
    })
    @IsString()
    thumbnail: string;
}