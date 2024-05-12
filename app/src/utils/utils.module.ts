import { Module } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';
import { DiscordBotService } from './discordBot.service';
import { UtilsService } from './utils.service';

@Module({
    providers: [CustomLoggerService, DiscordBotService, UtilsService],
    exports: [CustomLoggerService, DiscordBotService, UtilsService],
})
export class UtilsModule { }