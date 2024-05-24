import { Injectable } from "@nestjs/common";
import { AwsService } from "./aws.s3/aws.service";
import { UtilsService } from "../utils/utils.service";


//image.service.ts
@Injectable()
export class ImageService {
  constructor(
    private utilsService: UtilsService,
    private awsService: AwsService,
  ) { }


  // 테스트용 
  // 이미지 파일 S3에 저장 후 url return 
  async imageUpload(file: Express.Multer.File): Promise<string> {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );
    return imageUrl;
  }

  // 이모지
  async thumbnailImageUpload(file: Express.Multer.File, imageName: string): Promise<string> {
    // const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3Unchache(
      `profiles/${imageName}.${ext}`,
      file,
      ext,
    );
    return imageUrl;
  }

  // 이미지 파일 S3에 저장 후 url return 모듈화
  async emojiImageUpload(file: Express.Multer.File, imageName: string): Promise<string> {
    // const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `emoji/${imageName}.${ext}`,
      file,
      ext,
    );
    return imageUrl;
  }

  async bannerImageUpload(file: Express.Multer.File, imageName: string): Promise<string> {
    // const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3Unchache(
      `banner/${imageName}.${ext}`,
      file,
      ext,
    );
    return imageUrl;
  }

  //다수 이미지 파일 대해 S3에 비동기 업로드 후 각각의 url을 반환하는 Promise 배열을 생성
  async multipleImageUpload(files: Express.Multer.File[]): Promise<string[]> {
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


  // 피드 
  async feedImageUpload(file: Express.Multer.File, imageName: string): Promise<string> {
    // const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `feeds/${imageName}.${ext}`,
      file,
      ext,
    );
    return imageUrl;
  }


  // 테스트용 X 
  // feed 업로드에서 사용중
  async imageArrayUpload(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(async file => {
      const imageName = this.utilsService.getUUID();
      const ext = file.originalname.split('.').pop();

      const imageUrl = await this.awsService.imageUploadToS3(
        `feeds/${imageName}.${ext}`,
        file,
        ext
      );

      console.log(imageUrl);
      return imageUrl;
    });
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  }



}