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

  // 이미지 파일 S3에 저장 후 url return 모듈화
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

  // 이미지 파일 S3에 저장 후 url return 모듈화
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


  // async multipleImageAndTextFormUpload(
  //   files: Express.Multer.File[], 
  //   body :ImageMultyTextUploadDto
  // ): Promise<string[]> {

  //   const title = body.title
  //   const content = body.description
  //   const imgUrls = this.imageArrayUpload(files, "test")
  //   return imgUrls;

  // }



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