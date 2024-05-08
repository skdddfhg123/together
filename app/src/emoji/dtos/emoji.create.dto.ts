import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class ImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class CreateEmojiDTO { 
    

    @ApiProperty({
        description: 'Name of the Emoji GIF',
        example: '이모지 이름',
    })
    @IsString()
    emojiName: string;


    // 1개 업로드
    // @ApiProperty({ 
    //   type: 'string', 
    //   format: 'binary' 
    // })
    // @IsNotEmpty()
    // emojiFile: any;
    
}


    // 2개 이상 업로드
    /*
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
      @IsNotEmpty()
      images: ImageDto[];
      */ 