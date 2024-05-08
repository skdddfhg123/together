import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmojiController } from "./emoji.controller";
import { EmojiService } from "./emoji.service";
import { UserModule } from "src/db/user/user.module";
import { Calendar } from "src/calendar/entities/calendar.entity";
import { ImageModule } from "src/image.upload/image.module";
import { Emoji } from "./entities/emoji.entity";
import { Feed } from "src/feed/entities/feed.entity";
import { EmojiInFeed } from "src/db/emoji_feed/entities/emoji.feed.entity";
import { UtilsModule } from "src/image.upload/aws.s3/utils/utils.module";



@Module({
    imports: [
      TypeOrmModule.forFeature([Emoji, Calendar, Feed, EmojiInFeed]),
      UserModule,
      ImageModule,
      UtilsModule,
    ],
    controllers: [EmojiController],
    providers: [EmojiService],
      
    
  })
  export class emojiModule {}
  