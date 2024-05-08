// src/images/images.service.ts
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class EmojiService {
  private s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    }
  });

  async getImages() {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    };

    try {
        const data = await this.s3.listObjectsV2(params).promise();
        return data.Contents.map(({ Key }) => `https://${params.Bucket}.s3.amazonaws.com/${Key}`);
    }
    catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve images from S3');
    }
  }
}
