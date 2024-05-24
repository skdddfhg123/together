import { Injectable, Logger } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService {
    private readonly pubClient: RedisClient; // redisclient -> Room??
    private readonly redisClient: RedisClient;
    private readonly logger = new Logger(RedisService.name);
    public readonly subClient: RedisClient;

    constructor(

    ) {
        const options = {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
            password: process.env.REDIS_PASS,
        };

        this.pubClient = new Redis(options);
        this.subClient = new Redis(options);

        this.subClient.on('message', (channel, message) => {

            this.logger.log(`Received message: ${message} from channel: ${channel}`);
        });

        this.subClient.on('error', (error) => {

            this.logger.error('Error in Redis SubClient', error);
        });

        this.redisClient = new Redis(options);
    }

    async getSubscriberCount(channel: string): Promise<number> {
        try {
            // 'PUBSUB NUMSUB <channel>' 명령을 Redis 서버에 전송
            const result = await this.redisClient.sendCommand(new Redis.Command('PUBSUB', ['NUMSUB', channel], { replyEncoding: 'utf8' }));
            const count = parseInt(result[1], 10); // 결과에서 구독자 수 추출

            // 모든 활성 채널 조회
            this.redisClient.pubsub("CHANNELS", (err, channels) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("Active channels:", channels);
            });

            // 특정 패턴과 일치하는 채널 조회
            this.redisClient.pubsub("CHANNELS", "pattern:*", (err, channels) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("Matching channels:", channels);
            });

            return count;
        } catch (error) {
            this.logger.error('Error fetching subscriber count', error);
            throw error;
        }
    }

    async subscribe(channel: string): Promise<void> {
        await this.subClient.subscribe(channel);
        this.logger.log(`Restore Subscripbed ${channel}`);
    }

    async publish(channel: string, message: string): Promise<number> {
        return await this.pubClient.publish(channel, message);
    }

    async unsubscribe(channel: string): Promise<void> {
        await this.subClient.unsubscribe(channel);
        this.logger.log(`Unsubscribed from ${channel}`);
    }

    // Look Aside Cache Strategy
    async get(key: string): Promise<string | null> {
        try {
            const value = await this.redisClient.get(key);
            if (value) {
                this.logger.log(`Cache hit for key: ${key}`);
                return value;
            }
            this.logger.log(`Cache miss for key: ${key}`);
            return null;
        } catch (error) {
            this.logger.error(`Error retrieving key ${key} from Redis`, error);
            return null;
        }
    }

    async set(key: string, value: string, ttl: number): Promise<void> {
        try {
            await this.redisClient.set(key, value, 'EX', ttl);
            this.logger.log(`Set key ${key} in Redis`);
        } catch (error) {
            this.logger.error(`Error setting key ${key} in Redis`, error);
        }
    }

    // Write Around Cache Strategy
    async invalidate(key: string): Promise<void> {
        try {
            await this.redisClient.del(key);
            this.logger.log(`Invalidated key ${key} in Redis`);
        } catch (error) {
            this.logger.error(`Error invalidating key ${key} in Redis`, error);
        }
    }
}