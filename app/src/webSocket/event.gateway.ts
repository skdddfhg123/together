import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat/chat.service';
import { SetInitDTO } from './dtos/createChat.dto';
import * as jwt from 'jsonwebtoken';
import { SaveMessageDTO } from './dtos/saveMessage.dto';
import { RedisService } from './redis/redis.service';

@WebSocketGateway(5000, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true, // 웹 소켓 연결 시 자격 증명(쿠키 등)포함 허용 옵션
    },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private readonly chatService: ChatService,
        private readonly redisService: RedisService,
    ) { }

    @WebSocketServer()
    server: Server;

    // =================================================================================================================
    // |                                                 Connect                                                       |
    // =================================================================================================================

    public handleConnection(client: Socket): void {
        const token = client.handshake.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            client.data.nickname = decoded['nickname'];
            client.data.email = decoded['useremail'];
            console.log(client.data)
            client.leave(client.id);
            client.data.roomId = `mainRoom${client.data.email}`;
            client.join(`mainRoom${client.data.email}`);
        }
        catch (err) {
            console.log(err);
            client.emit('exception', { message: `invalid token` })
            client.disconnect();
        }
    }

    public handleDisconnect(client: Socket): void {
        const { roomId } = client.data;

        if (roomId !== `mainRoom${client.data.email}` && !this.server.sockets.adapter.rooms.get(roomId)) {
            this.chatService.exitChatRoom(client, roomId);
            this.server.emit('getChatRoomList', this.chatService.getChatRoomList());
        }
        console.log('disconnected', client.id);
    }

    // =================================================================================================================
    // |                                                    Chat                                                       |
    // =================================================================================================================

    @SubscribeMessage('sendMessage')
    async sendMessage(client: Socket, message: string): Promise<void> {
        client.rooms.forEach(roomId =>
            client.to(roomId).emit('getMessage', {
                id: client.id,
                email: client.data.email,
                nickname: client.data.nickname,
                message,
            }),
        );

        try {
            const newChatDto = new SaveMessageDTO();
            newChatDto.email = client.data.email;
            newChatDto.nickname = client.data.nickname;
            newChatDto.message = message;
            newChatDto.roomId = client.data.roomId;

            await this.chatService.saveMessage(newChatDto);
        } catch (err) {
            console.error(`message saved failed: ${err}`);
        }

        console.log(client.rooms);
    }


    @SubscribeMessage('sendCombinedMessage')
    async sendCombinedMessage(client: Socket, payload: { text: string, imageUrl: string }) {

        client.rooms.forEach((roomId) =>
            client.to(roomId).emit('getMessage', {
                id: client.id,
                email: client.data.email,
                nickname: client.data.nickname,
                message: payload?.text,
                image: payload?.imageUrl,
            }),
        );

        try {
            const newChatDto = new SaveMessageDTO();
            newChatDto.email = client.data.email;
            newChatDto.nickname = client.data.nickname;
            newChatDto.message = payload.text;
            newChatDto.imgUrl = payload.imageUrl;
            newChatDto.roomId = client.data.roomId;

            await this.chatService.saveMessage(newChatDto);
        }
        catch (err) {
            console.error(`message saved falied: ${err}`);
        }

        console.log(client.rooms)
    }

    //처음 접속시 닉네임 등 최초 설정
    @SubscribeMessage('setInit')
    setInit(client: Socket, data: SetInitDTO): SetInitDTO {
        // 이미 최초 세팅이 되어있는 경우 패스
        if (client.data.isInit) {
            return;
        }

        console.log(client.data)

        client.data.nickname = client.data.nickname
            ? client.data.nickname
            : '낯선사람' + client.id;

        client.data.isInit = true;

        return {
            nickname: client.data.nickname,
            room: {
                roomId: ('mainRoom' + client.data.email),
                roomName: ('mainRoom' + client.data.email),
            },
        };
    }

    @SubscribeMessage('enterChatRoom')
    async enterChatRoom(client: Socket, roomId: string) {
        let room = roomId;

        if (room == null || room == 'All') {
            room = 'mainRoom' + client.data.email;
        }

        if (client.rooms.has(room)) {
            return;
        }

        console.log(client.rooms);
        console.log(client.id);

        this.chatService.enterChatRoom(client, room);

        // const messages = await this.chatService.findLimitCntMessageByCalendarId(room, 1);
        const messages = await this.chatService.findAllMessageByCalendarId(room);

        console.log(messages);

        messages.forEach((message) => {
            client.emit('getMessage', {
                id: message._id,
                email: message.email,
                nickname: message.nickname,
                message: message.message,
                registeredAt: message.registeredAt,
            });
        });

        return {
            roomId: room,
            roomName: this.chatService.getChatRoom(room).roomName,
        };
    }

    @SubscribeMessage('sendImage')
    handleImage(client: Socket, payload: { imageUrl: string, calendarId: string }) {
        client.to(payload.calendarId).emit('receiveImage', payload.imageUrl);
    }

    @SubscribeMessage('getNextMessage')
    async getNextMessage(client: Socket, payload: { calendarId: string, time: string }): Promise<void> {
        const lastTime = new Date(payload.time);
        const newMessages = await this.chatService.getPagenationMessage(payload.calendarId, lastTime);

        newMessages.forEach((message) => {
            client.emit('getNextMessage', {
                id: message._id,
                email: message.email,
                nickname: message.nickname,
                message: message.message,
                registeredAt: message.registeredAt,
            });
        });
    }
}
