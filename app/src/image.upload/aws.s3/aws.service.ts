// aws.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { execFile } from 'child_process';
import * as fs from 'fs';
import * as util from 'util';
import { Express } from 'express';

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
    await this.s3Client.send(command);
    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  }


  // async imageUploadToS3(
  //   fileName: string,
  //   file: Express.Multer.File,
  //   ext: string,
  // ): Promise<string> {
 
  //   ext = ext.toLowerCase();

  //   // 지원하는 이미지 포맷
  //   const supportedFormats = ['jpeg', 'png', 'webp', 'gif', 'jpg'];
  //   if (!supportedFormats.includes(ext)) {
  //     throw new Error(`Unsupported image format: ${ext}`);
  //   }

  //   let processedImageBuffer;

  //   if (ext === 'gif') {
  //     // GIF 이미지 처리
  //     // 파일 확장자를 제외한 순수한 파일명을 추출
  //     const baseFileName = file.originalname.replace(/\.[^/.]+$/, "");
  //     // 임시 파일명 생성
  //     const outputPath = `temp-${baseFileName}`;
  //    // const outputPath = `temp-${file.originalname}`;
  //     await this.optimizeGif(file.path, outputPath);
  //     processedImageBuffer = fs.readFileSync(outputPath);
  //     fs.unlinkSync(outputPath); // 임시 파일 삭제
  //   } else {
  //     // Sharp를 사용한 이미지 처리
  //     processedImageBuffer = await sharp(file.buffer)
  //       .resize(800)
  //       .toFormat(ext as keyof sharp.FormatEnum, { quality: 80 })
  //       .toBuffer();
  //   }

  //   const command = new PutObjectCommand({
  //     Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
  //     Key: fileName,
  //     Body: file.buffer,
  //     ACL: 'public-read',
  //     ContentType: `image/${ext}`,
  //   });
  //   await this.s3Client.send(command);
  //   return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  // }


  async optimizeGif(inputPath: string, outputPath: string): Promise<void> {
    await execFilePromise('gifsicle', ['-o', outputPath, '--resize-fit-width', '800', inputPath]);
  }




}