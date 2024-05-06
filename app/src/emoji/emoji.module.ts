import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmojiController } from "./emoji.controller";
import { EmojiService } from "./emoji.service";
import { UserModule } from "src/db/user/user.module";
import { Calendar } from "src/calendar/entities/calendar.entity";
import { ImageModule } from "src/image.upload/image.module";
import { Emoji } from "./entities/emoji.entity";


@Module({
    imports: [
      TypeOrmModule.forFeature([Emoji, Calendar]),
      UserModule,
      ImageModule
  
    ],
    controllers: [EmojiController],
    providers: [EmojiService],
      
    
  })
  export class emojiModule {}
  