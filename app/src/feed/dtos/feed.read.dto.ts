import { ApiProperty } from "@nestjs/swagger";
import { Images } from "aws-sdk/clients/sagemaker";
import { IsArray, IsDate, IsDateString, IsString } from "class-validator";
import { FeedImage } from "src/db/feedImage/entities/feedImage.entity";
import { isDate } from "util/types";


export class ReadFeedDTO {
    
    @ApiProperty()
    @IsString()
    feedType: number;

    @ApiProperty()
    @IsString()
    feedId: string;
    
    @ApiProperty()
    @IsString()
    groupEventId: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsDateString()
    createdAt: Date;

    @ApiProperty()
    @IsDateString()
    updatedAt: Date;

    @ApiProperty()
    @IsString()
    nickname: string;

    @ApiProperty()
    @IsString()
    thumbnail: string;

    @ApiProperty()
    @IsArray()
    images: FeedImage[];
  
}