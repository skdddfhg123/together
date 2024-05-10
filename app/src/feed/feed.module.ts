import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEventModule } from 'src/db/event/group_event/groupEvent.module';
import { Feed } from './entities/feed.entity';
import { UserModule } from 'src/db/user/user.module';
import { FeedCommentService } from 'src/db/comment/comment.service';
import { FeedComment } from 'src/db/comment/entities/comment.entity';
import { ImageModule } from 'src/image.upload/image.module';
import { AwsModule } from 'src/image.upload/aws.s3/aws.module';
import { FeedImage } from 'src/db/feedImage/entities/feedImage.entity';
import { FeedCommentModule } from 'src/db/comment/comment.module';
import { UtilsModule } from 'src/utils/utils.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Feed, FeedComment, FeedImage]),
    GroupEventModule,
    UserModule,
    AwsModule,
    UtilsModule,
    ImageModule,
    // FeedCommentModule,
  ],
  controllers: [FeedController],
  providers: [FeedService, FeedCommentService],

  exports: [FeedService]
})
export class FeedModule { }
