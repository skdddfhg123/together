import { Injectable, Module, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DiscordBotService } from 'src/discordBot.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[Request] ${req.method} - ${req.url}`);
    res.on('finish', () => {
      console.log(`[Response] ${req.method} - ${req.url} - Status: ${res.statusCode}`);
    });
    next();
  }

  // constructor(private discordBotService: DiscordBotService) {}
  // 
  // use(req: Request, res: Response, next: NextFunction) {
  //   const requestInfo = {
  //     method: req.method,
  //     url: req.url,
  //     headers: req.headers,
  //     body: req.body,
  //     query: req.query,
  //     ip: req.ip
  //   };
    
  //   console.log(`[Request Info] ${JSON.stringify(requestInfo, null, 2)}`);
  //   res.on('finish', () => {
  //     const channel = this.discordBotService.getClient().channels.cache.get(process.env.DISCORD_BOT_CHANNEL_ID);
  //     const responseInfo = {
  //       statusCode: res.statusCode,
  //       headers: res.getHeaders(),
  //       contentLength: res.get('Content-Length') || 'unknown',
  //       cookies: res.get('Set-Cookie') || 'none'
  //     };

  //     if (channel && channel instanceof TextChannel) {
  //       channel.send(`[Request Info]\n ${JSON.stringify(requestInfo, null, 2)}\n`);
  //       channel.send(`[Response Info]\n ${JSON.stringify(responseInfo, null, 2)}`);
  //     }
  //     console.log(`[Response Info] ${req.method} - ${req.url} - ${JSON.stringify(responseInfo, null, 2)}`);
  //   });
  //   next();
  // }
}