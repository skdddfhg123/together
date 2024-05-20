import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { RedisService } from './redis.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(5005, {
    cors: {
        origin: true,
        credentials: true,
    },
})
export class RedisGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private redisService: RedisService) {
        // Redis의 메시지를 감지하여 클라이언트에게 전송
        this.redisService.subClient.on('message', (channel, message) => {
            this.server.to(channel).emit('redisMessage', { channel, message });
        });
    }

    handleConnection(client: Socket) {
        console.log('Redis Gateway Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Redis Gateway Client disconnected:', client.id);
    }
}
