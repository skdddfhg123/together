import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { ChatService } from './chat/chat.service';
import { Chat, ChatSchema } from './entities/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from './redis/redis.service';

@Module({
    imports: [
        // MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    ],
    controllers: [],
    providers: [
        EventGateway,
        ChatService,
        RedisService,
    ],
})
export class EventModule { }