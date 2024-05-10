import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { EmojiController } from './emoji.controller';
import { EmojiService } from './emoji.service';

@Module({
    imports: [
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
export class ChatModule {}