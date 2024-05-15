import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { execFile } from 'child_process';
import * as AWS from 'aws-sdk';
import * as util from 'util';

const execFilePromise = util.promisify(execFile);

@Injectable()
export class AwsService {
  private cloudFront = new AWS.CloudFront();
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

  async invalidateCache(paths: string[]): Promise<void> {
    const invalidationBatch = {
      Paths: {
        Quantity: paths.length,
        Items: paths.map(path => `/${path}`)
      },
      CallerReference: `invalidate-${new Date().getTime()}`
    };

    const params = {
      DistributionId: 'E17KVHFH3OC9HG',
      InvalidationBatch: invalidationBatch
    };

    try {
      const data = await this.cloudFront.createInvalidation(params).promise();
      console.log('Invalidation created:', data);
    } catch (error) {
      console.error('Error creating invalidation:', error);
    }
  }

  async imageUploadToS3Unchache(
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

    // CloudFront 캐시 무효화 호출
    await this.invalidateCache([fileName]);

    return `${process.env.AWS_S3_BUCKET_URL}/${fileName}`;
  }

  // AWS S3에 이미지를 그대로 업로드
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