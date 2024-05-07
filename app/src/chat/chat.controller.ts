import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './schema/chat.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('')
    @ApiOperation({ summary: 'Get all chat logs' })
    @ApiResponse({ status: 200, description: 'List of all chat logs' })
    async getAllChats(): Promise<Chat[]> {
        return this.chatService.getChatLogs();
    }

    @Post()
    @ApiOperation({ summary: 'Create a new chat log' })
    @ApiBody({ description: 'Chat data', type: Chat })
    @ApiResponse({ status: 201, description: 'The created chat log', type: Chat })
    async createChat(@Body() chat: Chat): Promise<Chat> {
        return this.chatService.createChatLog(chat.sender, chat.message);
    }
}