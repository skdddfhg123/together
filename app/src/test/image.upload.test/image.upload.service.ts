//image.service.ts

import { Injectable } from "@nestjs/common";
import { AwsService } from "src/image.upload/aws.s3/aws.service";

import { SingleImageAndTextUploadTestDto } from "./dtos/image.text.dto";
import { MultipleImageAndTextUploadTestDto } from "./dtos/images.text.dto";
import { UtilsService } from "src/utils/utils.service";

@Injectable()
export class ImageUploadTestService {
  constructor(
    private utilsService: UtilsService,
    private awsService: AwsService
  ) { }

  // 이미지 파일 1개 S3에 저장 후 url return 
  async singleImageUploadTest(file: Express.Multer.File): Promise<string> {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );
    return imageUrl;
  }


  //다수 이미지 파일 대해 S3에 비동기 업로드 후 각각의 url을 반환하는 Promise 배열을 생성
  async multipleImageUploadTest(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(async file => {
      const imageName = this.utilsService.getUUID();
      const ext = file.originalname.split('.').pop();
      const imageUrl = await this.awsService.imageUploadToS3(
        `${imageName}.${ext}`,
        file,
        ext
      );
      return imageUrl;
    });
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  }



  // 이미지 파일 1개 S3에 저장, 텍스트 입력 후 url return 
  async singleImageAndTextUploadTest(
    file: Express.Multer.File,
    body: SingleImageAndTextUploadTestDto
  ): Promise<{ imageUrl: string, title: string, description: string }> {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );
    const { title, description } = body

    return { imageUrl, title, description };
  }



  async multipleImageAndTextUploadTest(
    files: Express.Multer.File[],
    body: MultipleImageAndTextUploadTestDto): Promise<{ imageUrls: string[], title: string, description: string }> {
    const uploadPromises = files.map(async file => {
      const imageName = this.utilsService.getUUID();
      const ext = file.originalname.split('.').pop();
      const imageUrl = await this.awsService.imageUploadToS3(
        `${imageName}.${ext}`,
        file,
        ext
      );
      return imageUrl;
    });
    const { title, description } = body
    const imageUrls = await Promise.all(uploadPromises);
    return { imageUrls, title, description };
  }

}