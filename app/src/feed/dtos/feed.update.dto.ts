import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID, IsInt, ValidateNested, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { FeedImage } from '../../db/feedImage/entities/feedImage.entity';

export class UpdateFeedDTO {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ 
        description: 'Type of the feed to be updated',
        example: '2'    
    })
    feedType?: number;
    
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ 
        description: 'Title of the feed to be updated', 
        example: '수정된 제목'
    })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ 
        description: 'Content of the feed to be updated',
        example: '수정된 내용'
     })
    content?: string;

    // @IsOptional()
    // @ApiPropertyOptional({ description: 'Feed images of the feed to be updated' })
    // feedImages?: FeedImage[];

}