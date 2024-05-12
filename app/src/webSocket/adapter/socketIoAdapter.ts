import { IoAdapter } from "@nestjs/platform-socket.io";
import { RedisService } from "../redis/redis.service";
import { createAdapter } from "@socket.io/redis-adapter";

export class SocketIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;

    constructor(
        app: any,
        private readonly redisService: RedisService,
    ) {
        super(app);
    }

    async connectToRedis(): Promise<void> {
        const pubClient = this.redisService.getRedisClient();
        const subClient = pubClient.duplicate();

        this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);

        return server;
    }
}