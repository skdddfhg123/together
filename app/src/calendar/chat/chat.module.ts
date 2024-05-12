import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { EmojiController } from './emoji.controller';
import { EmojiService } from './emoji.service';
import { Chat, ChatSchema } from './entities/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])
    ],
    controllers: [
        EmojiController,
    ],
    providers: [
        ChatGateway,
        ChatService,
        EmojiService,
    ],
})
export class ChatModule { }