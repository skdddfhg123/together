import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

class ImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class ImageMultyUploadDto {
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