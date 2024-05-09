import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID, IsInt, ValidateNested, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { FeedImage } from '../../db/feedImage/entities/feedImage.entity';

class ImageDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File;
  }



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


    @ApiPropertyOptional({
        type: 'array',
        description: 'Array of image files',
        required: false,
        items: {
          type: 'string', format: 'binary'
        }
      })
      @IsArray()
      @IsOptional()
      @ValidateNested({ each: true })
      @Type(() => ImageDto)
      images: ImageDto[];
    // @IsOptional()
    // @ApiPropertyOptional({ description: 'Feed images of the feed to be updated' })
    // feedImages?: FeedImage[];

}