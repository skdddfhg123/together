import { Module } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';
import { DiscordBotService } from './discordBot.service';

@Module({
    providers: [CustomLoggerService, DiscordBotService],
    exports: [CustomLoggerService],
})
export class UtilModule { }