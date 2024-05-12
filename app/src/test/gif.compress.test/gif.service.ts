import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { execFile } from 'child_process';
import * as util from 'util';
import * as fs from 'fs';

const execFilePromise = util.promisify(execFile);

@Injectable()
export class GifService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadGifToS3(file: Express.Multer.File): Promise<string> {
    const tempOutputPath = `temp-${file.originalname}`;
    console.log(tempOutputPath)
    console.log(file.path)
    await this.compressGif(file.path, tempOutputPath);
    
    try {
      if (!fs.existsSync(tempOutputPath)) {
        throw new Error('Temporary file does not exist');
      }
  
      const fileData = fs.readFileSync(tempOutputPath);
      const key = `uploads/${file.originalname}`;
      await this.uploadFileToS3(key, fileData, 'image/gif');
  
      return `https://${this.configService.get<string>('AWS_S3_BUCKET_NAME')}.s3.amazonaws.com/${key}`;
    } finally {
      if (fs.existsSync(tempOutputPath)) {
        fs.unlinkSync(tempOutputPath);
      }
    }
  }

  private async compressGif(inputPath: string, outputPath: string): Promise<void> {
    try {
      await execFilePromise('gifsicle', ['-o', outputPath, '--resize-fit-width', '800', inputPath]);
    } catch (error) {
      console.error('Error compressing GIF:', error);
      throw new Error('Failed to compress GIF');
    }
  }
  

  private async uploadFileToS3(key: string, body: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: key,
      Body: body,
      ACL: 'public-read',
      ContentType: contentType,
    });
    await this.s3Client.send(command);
  }
}