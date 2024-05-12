import { Injectable } from "@nestjs/common";
import { ChatRoomListDTO } from "../dtos/createChat.dto";
import { Socket } from 'socket.io';
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "../entities/chat.schema";
import { Connection, Model } from "mongoose";
import { SaveMessageDTO } from "../dtos/saveMessage.dto";

@Injectable()
export class ChatService {
    private chatRoomList: Record<string, ChatRoomListDTO>;
    constructor(
        @InjectConnection()
        private chatConnection: Connection,
    ) {
        this.chatRoomList = {
            'roomMain': {
                roomId: 'roomMain',
                roomName: 'roomMain',
                cheifId: null,
            },
        };
    }

    private getModelForCalendar(calendarId: string): Model<Chat> {
        const collectionName = calendarId;
        return this.chatConnection.model<Chat>(
            collectionName,
            ChatSchema,
            collectionName
        );
    }

    createChatRoom(client: Socket, roomName: string): void {
        const roomId = roomName;
        const nickname: string = client.data.nickname;

        // return this.chatRoomList[roomId];
        this.chatRoomList[roomId] = {
            roomId,
            cheifId: client.id,
            roomName,
        };

        client.data.roomId = roomId;
    }

    enterChatRoom(client: Socket, roomId: string) {
        client.data.roomId = roomId;
        const { nickname } = client.data.nickname;
        const roomName = this.chatRoomList[roomId];
        if (!roomName) {
            this.createChatRoom(client, roomId);
        }
        console.log("enterRoom");
        client.rooms.clear();
        client.join(roomId);
    }

    exitChatRoom(client: Socket, roomId: string) {
        client.data.roomId = `room:lobby`;
        client.rooms.clear();
        client.join(`room:lobby`);
        const { nickname } = client.data;
        client.to(roomId).emit('getMessage', {
            id: null,
            nickname: '안내',
            message: '"' + nickname + '"님이 방에서 나갔습니다.',
        });
    }

    getChatRoom(roomId: string): ChatRoomListDTO | null {
        return this.chatRoomList[roomId];
    }

    async saveMessage(saveMessageDto: SaveMessageDTO): Promise<Chat> {
        const { roomId } = saveMessageDto;
        const chatModel = this.getModelForCalendar(roomId);
        const saveMessage = new chatModel(saveMessageDto);
        return await saveMessage.save();
    }

    async findAllMessageByCalendarId(calendarId: string): Promise<Chat[]> {
        const chatModel = this.getModelForCalendar(calendarId);

        return await chatModel.find();
    }

    async findLimitCntMessageByCalendarId(calendarId: string, skipPage: number): Promise<Chat[]> {
        const chatModel = this.getModelForCalendar(calendarId);

        const limit = 10;
        const skipNum = (skipPage - 1) * limit;

        return await chatModel.find().skip(skipNum).limit(10);
    }

    async getPagenationMessage(calendarId: string, lastTime: Date): Promise<Chat[]> {
        const chatModel = this.getModelForCalendar(calendarId);

        return await chatModel.find({registeredAt: {$lt: lastTime}}).sort({registeredAt: -1}).limit(10);
    }

    async findThreeDaysAgoMessageByCalendarId(calendarId: string): Promise<Chat[]> {
        const threeDays = 3 * 24 * 60 * 60 * 1000;
        const threeDaysAgo = new Date(Date.now() - threeDays);

        const chatModel = this.getModelForCalendar(calendarId);

        return await chatModel.find({
            registeredAt: { $gte: threeDaysAgo },
        });
    }

    getChatRoomList(): Record<string, ChatRoomListDTO> {
        return this.chatRoomList;
    }

    deleteChatRoom(roomId: string) {
        delete this.chatRoomList[roomId];
    }
}