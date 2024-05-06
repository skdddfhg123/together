import { Module } from "@nestjs/common";
import { UtilsModule } from "./aws.s3/utils/utils.module";
import { AwsModule } from "./aws.s3/aws.module";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feed } from "src/feed/entities/feed.entity";
import { FeedImage } from "src/db/feedImage/entities/feedImage.entity";

// image.module.ts
@Module({
    imports: [TypeOrmModule.forFeature([Feed, FeedImage]),
      UtilsModule,
      AwsModule,
    ],
    controllers: [ImageController],
    providers: [ImageService],
    exports: [ImageService]

  })
  export class ImageModule {}