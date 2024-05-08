import { Injectable, Module, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TextChannel } from 'discord.js';
import * as Sentry from '@sentry/node';
import { DiscordBotService } from './discordBot.service';


@Injectable()
export class CustomLoggerService {
    constructor(private readonly discordBotService: DiscordBotService) { }

    async logRequestResponse(req: Request, res: Response, channelId: string, errorChannelId: string) {
        const requestInfo = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body,
            query: req.query,
            ip: req.ip,
        };

        console.log(`[Request Info] ${JSON.stringify(requestInfo, null, 2)}`);

        const startTime = Date.now();

        let originalSend = res.send;
        let chunks: any[] = [];

        res.send = function (chunk: any) {
            if (chunk !== undefined) {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            return originalSend.apply(res, arguments);
        };

        res.on('finish', () => {
            const responseTime = Date.now() - startTime;
            const body = Buffer.concat(chunks).toString('utf8');


            let prettyBody: string;
            try {
                prettyBody = JSON.stringify(JSON.parse(body), null, 2);
                prettyBody = `\`\`\`json\n${prettyBody}\n\`\`\``;
            } catch (error) {
                prettyBody = `\`\`\`\n${body}\n\`\`\``;
            }

            // Error log
            console.log(res.statusCode);
            if (res.statusCode >= 400) {
                const errorChannel = this.discordBotService.getClient().channels.cache.get(errorChannelId);
                // console.log(errorChannel);
                if (errorChannel && errorChannel instanceof TextChannel) {
                    errorChannel.send(`[Error Occur]\n[req.INFO]\n${requestInfo}\n`);
                }
                try {
                    const parsedBody = JSON.parse(body);
                    Sentry.captureException(new Error(`Error Response: ${res.statusCode}`), {
                        level: 'error',
                        extra: {
                            method: req.method,
                            url: req.originalUrl,
                            statusCode: res.statusCode,
                            requestBody: req.body,
                            responseBody: parsedBody,
                            headers: req.headers
                        }
                    });
                } catch (e) {
                    Sentry.captureException(new Error(`Error Response: ${res.statusCode}`), {
                        level: 'error',
                        extra: {
                            method: req.method,
                            url: req.originalUrl,
                            statusCode: res.statusCode,
                            requestBody: req.body,
                            responseBody: body,
                            headers: req.headers
                        }
                    });
                }
            }

            // Limit the length to 2000 characters, including "..."
            const maxLength = 1000;
            if (prettyBody.length > maxLength) {
                prettyBody = prettyBody.slice(0, maxLength - 3) + '...' + `\`\`\``;
            }

            const responseInfo = {
                statusCode: res.statusCode,
                headers: res.getHeaders(),
                contentLength: res.get('Content-Length') || 'unknown',
                cookies: res.get('Set-Cookie') || 'none',
                responseTime: responseTime,
            };

            const channel = this.discordBotService.getClient().channels.cache.get(channelId);
            if (channel && channel instanceof TextChannel) {
                channel.send(`[Request Info]\njson\n${JSON.stringify(requestInfo, null, 2)}\n`);
                channel.send(`[Response Info]\njson\n${JSON.stringify(responseInfo, null, 2)}\n`);
                channel.send(`[Response body]\n${prettyBody}`);
            }
            console.log(`[Response Info] ${req.method} - ${req.url} - ${JSON.stringify(responseInfo, null, 2)}`);
        });
    }
}
