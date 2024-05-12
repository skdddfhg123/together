import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GifService } from './gif.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerOptions } from './multer.config';

@ApiTags("gif")
@Controller('gif')
export class GifController {
  constructor(private gifService: GifService) {}




  @Post('compress')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiBody({
    schema: {
        type: 'object',
        properties: {
            file: {
                type: 'string',
                format: 'binary',
                description: 'Emoji image file'
            }
        }
    }
})
  @ApiConsumes('multipart/form-data', 'application/json')
  async uploadGif(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
    console.log(file.destination)
    console.log(file.fieldname)
    console.log(file.filename)
    console.log(file.mimetype)
    console.log(file.originalname)
    console.log(file.path)
    console.log(file.size)
    const imageUrl = await this.gifService.uploadGifToS3(file);
    return { imageUrl };
  }
}