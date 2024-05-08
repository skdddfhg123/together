import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './entities/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    imports: [
        // MongooseModule.forFeature([{name: Chat.name, schema: ChatSchema}])
    ],
    providers: [
        ChatGateway,
        ChatService,
    ],
})
export class ChatModule {}