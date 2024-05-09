import { ApiProperty} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";

class ImageDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File;
  }

export class CreateFeedDTO { // 유저로부터 실제로 받는 data
    
    @ApiProperty({
        description: 'Type of the Feed. This value is Integer',
        example: '0',
    })
    @Type(() => Number)
    @IsNumber()
    feedType: number;


    @ApiProperty({
        description: 'Title of the Feed',
        example: '피드의 제목',
    })
    @IsString()
    title: string;



    @ApiProperty({
        description: 'content written in Feed',
        example: '피드의 내용',
    })
    @IsString()
    content: string;



    // Client -> this DTO -> AWS S3 
    @ApiProperty({
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

    
}


    