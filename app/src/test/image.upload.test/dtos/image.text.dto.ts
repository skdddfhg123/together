import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class ImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class SingleImageAndTextUploadTestDto {

@ApiProperty({
    description: 'Title for the image upload',
    example: 'Holiday Photos'
    })
    @IsString()
    title: string;

    @ApiProperty({
    description: 'Description of the image upload',
    example: 'Photos from my recent trip to the beach.'
    })
    @IsString()
    description: string;


    @ApiProperty({ type: 'string', format: 'binary' })
    @IsNotEmpty()
    file: any;

  // @ApiProperty({
  //   type: 'array',
  //   description: 'Array of image files',
  //   required: false,
  //   items: {
  //     type: 'string', format: 'binary'
  //   }
  // })
  // @IsArray()
  // @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => ImageDto)
  // images: ImageDto[];

}