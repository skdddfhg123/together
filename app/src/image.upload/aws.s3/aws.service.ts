import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { execFile } from 'child_process';
import * as util from 'util';

const execFilePromise = util.promisify(execFile);

@Injectable()
export class AwsService {
  s3Client: S3Client;
  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }


  async imageUploadToS3(
    fileName: string,
    file: Express.Multer.File,
    ext: string,
  ) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });
    console.log(command);
    await this.s3Client.send(command);
    return `${process.env.AWS_S3_CLOUDFRONT_URL}/${fileName}`;
  }

  async optimizeGif(inputPath: string, outputPath: string): Promise<void> {
    await execFilePromise('gifsicle', ['-o', outputPath, '--resize-fit-width', '800', inputPath]);
  }
}