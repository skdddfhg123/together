import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SetInitDTO } from './dtos/createChat.dto';
import * as jwt from 'jsonwebtoken';
import { getPayload } from 'src/auth/getPayload.decorator';
import { PayloadResponse } from 'src/auth/dtos/payload-response';

@WebSocketGateway(5000, {
    cors: {
        origin: 'http://localhost:3001',
        credentials: true,
    },
})
export class ChatGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private readonly chatService: ChatService) {}
    @WebSocketServer()
    server: Server;

    // 소켓 연결시 유저목록에 추가
    public handleConnection(client: Socket): void {

        const token = client.handshake.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
            client.data.nickname = decoded['nickname'];
            console.log(client.data)
            // console.log('connected', client.id);
            client.leave(client.id);
            client.data.roomId = `room:lobby`;
            client.join('room:lobby');
        }
        catch(err) {
            client.disconnect(true);
            throw new WsException(`invalid token: ${token}`);
        }
    }

    //소켓 연결 해제시 유저목록에서 제거
    public handleDisconnect(client: Socket): void {
        const { roomId } = client.data;
        if (
            roomId != 'room:lobby' &&
            !this.server.sockets.adapter.rooms.get(roomId)
        ) {
            this.chatService.deleteChatRoom(roomId);
            this.server.emit(
                'getChatRoomList',
                this.chatService.getChatRoomList(),
            );
        }
        console.log('disonnected', client.id);
    }

    //메시지가 전송되면 모든 유저에게 메시지 전송
    @SubscribeMessage('sendMessage')
    sendMessage(client: Socket, message: string): void {

        // console.log(message);
        client.rooms.forEach((roomId) =>
            client.to(roomId).emit('getMessage', {
                id: client.id,
                nickname: client.data.nickname,
                message,
            }),
        );
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
                roomId: 'room:lobby',
                roomName: '로비',
            },
        };
    }

    //채팅방 목록 가져오기
    @SubscribeMessage('getChatRoomList')
    getChatRoomList(client: Socket, payload: any) {
        client.emit('getChatRoomList', this.chatService.getChatRoomList());
    }

    //채팅방 생성하기
    @SubscribeMessage('createChatRoom')
    createChatRoom(client: Socket, roomName: string) {
        //이전 방이 만약 나 혼자있던 방이면 제거
        if (
            client.data.roomId != 'room:lobby' &&
            this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
        ) {
            this.chatService.deleteChatRoom(client.data.roomId);
        }

        this.chatService.createChatRoom(client, roomName);
        console.log(`${roomName} Created.`)
        return {
            roomId: client.data.roomId,
            roomName: this.chatService.getChatRoom(client.data.roomId)
                .roomName,
        };
    }

    //채팅방 들어가기
    @SubscribeMessage('enterChatRoom')
    enterChatRoom(client: Socket, roomId: string) {
        //이미 접속해있는 방 일 경우 재접속 차단
        if (client.rooms.has(roomId)) {
            return;
        }
        //이전 방이 만약 나 혼자있던 방이면 제거
        if (
            client.data.roomId != 'room:lobby' &&
            this.server.sockets.adapter.rooms.get(client.data.roomId).size == 1
        ) {
            this.chatService.deleteChatRoom(client.data.roomId);
        }
        this.chatService.enterChatRoom(client, roomId);
        return {
            roomId: roomId,
            roomName: this.chatService.getChatRoom(roomId).roomName,
        };
    }
}
