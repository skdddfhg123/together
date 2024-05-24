import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeedComment } from "./entities/comment.entity";
import { FeedCommentService } from "./comment.service";
import { FeedModule } from "src/feed/feed.module";
import { UserModule } from "../user/user.module";
import { Feed } from "src/feed/entities/feed.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedComment, Feed]),
    FeedModule,
    UserModule

  ],
  providers: [FeedCommentService],
    
  exports:[FeedCommentService]
})
export class FeedCommentModule {}
