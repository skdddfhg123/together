import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './schema/chat.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel
            (Chat.name) private chatModel: Model<Chat>
    ) { }

    async createChatLog(sender: string, message: string): Promise<Chat> {
        const newChat = new this.chatModel({ sender, message });
        return newChat.save();
    }

    async getChatLogs(): Promise<Chat[]> {
        return this.chatModel.find().exec();
    }
}
