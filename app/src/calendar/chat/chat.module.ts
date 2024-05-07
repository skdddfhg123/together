import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
@Module({
    imports: [
        // TypeOrmModule.forFeature([Chat]),
    ],
    providers: [
        ChatGateway,
        ChatService,
    ],
})
export class ChatModule {}