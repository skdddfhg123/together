import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { CalendarModule } from 'src/calendar/calendar.module';
import { JWTStrategy } from 'src/auth/strategy/jwt.strategy';
import { TokensModule } from 'src/db/tokens/tokens.module';

@Module({
    imports: [
        // TypeOrmModule.forFeature([Chat]),
        // CalendarModule,
        // TokensModule,
    ],
    providers: [
        ChatGateway,
        ChatService,
        // JWTStrategy,
    ],
})
export class ChatModule {}