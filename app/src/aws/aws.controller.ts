import { Controller, Post, UseInterceptors, UploadedFile, Body, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from './aws.service';
import { ApiConsumes, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('aws')
@Controller('aws')
export class AwsController {
  constructor(private awsService: AwsService) {}

  @Post('upload')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileName: { type: 'string', description: 'Name of the file' },
        ext: { type: 'string', description: 'File extension' },
        file: { type: 'string', format: 'binary', description: 'File to upload' },
      },
    },
  })
  @HttpCode(200)
  @ApiOperation({ summary: 'Upload image to AWS S3' })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully', type: String })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('fileName') fileName: string,
    @Body('ext') ext: string
  ): Promise<string> {
    return this.awsService.imageUploadToS3(fileName, file, ext);
  }
}
