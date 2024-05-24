import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageUploadTestController } from "./image.upload.controller";
import { ImageUploadTestService } from "./image.upload.service";



@Module({
    imports: [
      TypeOrmModule.forFeature([]),
      
    ],
    controllers: [ImageUploadTestController],
    providers: [ImageUploadTestService],
      
    
  })
  export class imageUploadModule {}
  