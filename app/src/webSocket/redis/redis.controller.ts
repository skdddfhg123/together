import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('redis')
export class RedisController {
    constructor(private readonly redisService: RedisService) {}

    @Post('publish')
    @ApiOperation({ summary: 'Publish message to a channel' })
    @ApiBody({ 
        schema: {
            type: 'object',
            required: ['channel', 'message'],
            properties: { channel: { type: 'string' } , message: { type: 'string' } },
        },
    })
    publish(@Body() payload: { channel: string; message: string }) {
        const { channel, message } = payload;
        return this.redisService.publish(channel, message);
    }

    @Get('subscribe/:channel')
    @ApiOperation({ summary: 'Subscribe to a channel' })
    subscribe(@Param('channel') channel: string) {
        return this.redisService.subscribe(channel);
    }

    @Get('unsubscribe/:channel')
    @ApiOperation({ summary: 'UnSubscribe to a channel' })
    unsubscribe(@Param('channel') channel: string) {
        return this.redisService.unsubscribe(channel);
    }

    @ApiBody({ 
        schema: {
            type: 'object',
            required: ['key', 'value', 'ttl'],
            properties: { key: { type: 'string' } , value: { type: 'string' } , ttl: { type: 'number' }},
        },
    })
    @Post('set')
    set(@Body() payload: { key: string; value: string; ttl: number }) {
        return this.redisService.set(payload.key, payload.value, payload.ttl);
    }

    @Get('get/:key')
    get(@Param('key') key: string) {
        return this.redisService.get(key);
    }

    @Post('invalidate')
    invalidate(@Body() payload: { key: string }) {
        return this.redisService.invalidate(payload.key);
    }
}
