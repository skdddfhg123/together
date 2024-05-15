import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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

  // async invalidateCache(paths: string[]): Promise<void> {
  //   const invalidationBatch = {
  //     Paths: {
  //       Quantity: paths.length,
  //       Items: paths.map(path => `/${path}`)
  //     },
  //     CallerReference: `invalidate-${new Date().getTime()}`
  //   };

  //   const params = {
  //     DistributionId: 'E17KVHFH3OC9HG',
  //     InvalidationBatch: invalidationBatch
  //   };

  //   try {
  //     const data = await this.cloudFront.createInvalidation(params).promise();
  //     console.log('Invalidation created:', data);
  //   } catch (error) {
  //     console.error('Error creating invalidation:', error);
  //   }
  // }

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
    // await this.invalidateCache([fileName]);

    return `${process.env.AWS_S3_BUCKET_URL}/${fileName}`;
  }

  async imageDeleteInS3(folderName: string, imageUrl: string) {
    const parsingUrl = imageUrl.lastIndexOf('/');
    const fileName = imageUrl.substring(parsingUrl + 1);

    const key = `${folderName}/${fileName}`;

    const deleteParams = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
    }

    try {
      const command = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(command);
      console.log(`File ${key} deleted successfully`);
    } 
    catch (error) {
      console.error(`Error deleting file ${key}:`, error);
    }
  }

  async optimizeGif(inputPath: string, outputPath: string): Promise<void> {
    await execFilePromise('gifsicle', ['-o', outputPath, '--resize-fit-width', '800', inputPath]);
  }
}