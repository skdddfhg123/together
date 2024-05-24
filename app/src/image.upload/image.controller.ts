import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ImageUploadDto } from "./dtos/image.dto";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Body, Controller, HttpCode, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageMultyUploadDto } from "./dtos/images.dto";
import { ImageMultyTextUploadDto } from "./dtos/image.text.dto";

@ApiTags("imageTest")
@Controller('imagetest')
export class ImageController {

    constructor(
        private imageService: ImageService,
    ) {}

  @ApiOperation({ summary: 'Upload single image for Test' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image upload',
    type: ImageUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('image')
  async saveImage(@UploadedFile() file: Express.Multer.File) {
    return await this.imageService.imageUpload(file);
  }

  @Post('image/multy')
  @ApiOperation({ summary: 'Upload multiple images for Test' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImageMultyUploadDto })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 }
  ]))
  async uploadImages(@UploadedFiles() files: { images?: Express.Multer.File[] }) {
    if (!files.images || files.images.length === 0) {
      return { message: 'No images uploaded' };
    }
    const urls = await this.imageService.multipleImageUpload(files.images);
    return {
      message: 'Images uploaded successfully',
      urls: urls
    };
  }

  // @Post('image/multy/text')
  // @ApiOperation({ summary: 'Upload multiple images with text for Test' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: ImageMultyTextUploadDto })
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'images', maxCount: 5 }
  // ]))
  // async uploadThings(
  //   @UploadedFiles() files: { images?: Express.Multer.File[]},
  //   @Body() body: ImageMultyTextUploadDto
  //    ) {
  //   if (!files.images || files.images.length === 0) {
  //     return { message: 'No images uploaded' };
  //   }
  //   const urls = await this.imageService.multipleImageAndTextFormUpload(files.images, body);
  //   return {
  //     message: 'Images uploaded successfully',
  //     urls: urls,
  //     title: body.title,
  //     description: body.description
  //   };
  // }


  




}