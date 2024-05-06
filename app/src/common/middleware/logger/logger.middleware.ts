import { Injectable, Module, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DiscordBotService } from 'src/discordBot.service';
import { TextChannel } from 'discord.js';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  // use(req: Request, res: Response, next: NextFunction) {
  //   console.log(`[Request] ${req.method} - ${req.url}`);
  //   res.on('finish', () => {
  //     console.log(`[Response] ${req.method} - ${req.url} - Status: ${res.statusCode}`);
  //   });
  //   next();
  // }

  constructor(private discordBotService: DiscordBotService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const requestInfo = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      ip: req.ip
    };

    console.log(`[Request Info] ${JSON.stringify(requestInfo, null, 2)}`);
    res.on('finish', () => {
      const channel = this.discordBotService.getClient().channels.cache.get(process.env.DISCORD_BOT_CHANNEL_ID);
      const responseInfo = {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        contentLength: res.get('Content-Length') || 'unknown',
        cookies: res.get('Set-Cookie') || 'none'
      };

      if (channel && channel instanceof TextChannel) {
        channel.send(`[Request Info]\n ${JSON.stringify(requestInfo, null, 2)}\n`);
        channel.send(`[Response Info]\n ${JSON.stringify(responseInfo, null, 2)}`);
      }
      console.log(`[Response Info] ${req.method} - ${req.url} - ${JSON.stringify(responseInfo, null, 2)}`);
    });
    next();
  }
}

@Injectable()
export class AuthLoggerMiddleware implements NestMiddleware {
  constructor(private readonly discordBotService: DiscordBotService) { }

  use(req: Request, res: Response, next: NextFunction) {
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
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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

      const responseInfo = {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        contentLength: res.get('Content-Length') || 'unknown',
        cookies: res.get('Set-Cookie') || 'none',
        responseTime: responseTime,
      };

      const channel = this.discordBotService.getClient().channels.cache.get('1237047183753347174');

      if (channel && channel instanceof TextChannel) {
        channel.send(`[Request Info]\n ${JSON.stringify(requestInfo, null, 2)}\n`);
        channel.send(`[Response Info]\n ${JSON.stringify(responseInfo, null, 2)}`);
        channel.send(`[Response body]\n${prettyBody}`);
      }

      console.log(`[Response Info] ${req.method} - ${req.url} - ${JSON.stringify(responseInfo, null, 2)}`);
    });

    next();
  }
}

@Injectable()
export class CalendarLoggerMiddleware implements NestMiddleware {
  constructor(private readonly discordBotService: DiscordBotService) { }

  use(req: Request, res: Response, next: NextFunction) {
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
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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

      const responseInfo = {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        contentLength: res.get('Content-Length') || 'unknown',
        cookies: res.get('Set-Cookie') || 'none',
        responseTime: responseTime,
      };

      const channel = this.discordBotService.getClient().channels.cache.get('1237047690798305353');

      if (channel && channel instanceof TextChannel) {
        channel.send(`[Request Info]\n ${JSON.stringify(requestInfo, null, 2)}\n`);
        channel.send(`[Response Info]\n ${JSON.stringify(responseInfo, null, 2)}`);
        channel.send(`[Response body]\n${prettyBody}`);
      }

      console.log(`[Response Info] ${req.method} - ${req.url} - ${JSON.stringify(responseInfo, null, 2)}`);
    });

    next();
  }
}

@Injectable()
export class GroupEventLoggerMiddleware implements NestMiddleware {
  constructor(private readonly discordBotService: DiscordBotService) { }

  use(req: Request, res: Response, next: NextFunction) {
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
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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
        prettyBody = `\`\`\`\n${body}\n\`\`\``; // Not JSON, keep original and format it
      }

      const responseInfo = {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        contentLength: res.get('Content-Length') || 'unknown',
        cookies: res.get('Set-Cookie') || 'none',
        responseTime: responseTime,
      };

      const channel = this.discordBotService.getClient().channels.cache.get('1237050219649175552');

      if (channel && channel instanceof TextChannel) {
        channel.send(`[Request Info]\n ${JSON.stringify(requestInfo, null, 2)}\n`);
        channel.send(`[Response Info]\n ${JSON.stringify(responseInfo, null, 2)}`);
        channel.send(`[Response body]\n${prettyBody}`);
      }

      console.log(`[Response Info] ${req.method} - ${req.url} - ${JSON.stringify(responseInfo, null, 2)}`);
    });

    next();
  }
}

@Injectable()
export class PlatformLoggerMiddleware implements NestMiddleware {
  constructor(private readonly discordBotService: DiscordBotService) { }

  use(req: Request, res: Response, next: NextFunction) {
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
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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
        prettyBody = `\`\`\`\n${body}\n\`\`\``; // Not JSON, keep original and format it
      }

      const responseInfo = {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        contentLength: res.get('Content-Length') || 'unknown',
        cookies: res.get('Set-Cookie') || 'none',
        responseTime: responseTime,
      };

      const channel = this.discordBotService.getClient().channels.cache.get('1237047898651496510');

      if (channel && channel instanceof TextChannel) {
        channel.send(`[Request Info]\n ${JSON.stringify(requestInfo, null, 2)}\n`);
        channel.send(`[Response Info]\n ${JSON.stringify(responseInfo, null, 2)}`);
        channel.send(`[Response body]\n${prettyBody}`);
      }

      console.log(`[Response Info] ${req.method} - ${req.url} - ${JSON.stringify(responseInfo, null, 2)}`);
    });

    next();
  }
}

@Injectable()
export class KakaoLoggerMiddleware implements NestMiddleware {
  constructor(private readonly discordBotService: DiscordBotService) { }

  use(req: Request, res: Response, next: NextFunction) {
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
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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
        prettyBody = `\`\`\`\n${body}\n\`\`\``; // Not JSON, keep original and format it
      }

      const responseInfo = {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        contentLength: res.get('Content-Length') || 'unknown',
        cookies: res.get('Set-Cookie') || 'none',
        responseTime: responseTime,
      };

      const channel = this.discordBotService.getClient().channels.cache.get('1237050494921211985');

      if (channel && channel instanceof TextChannel) {
        channel.send(`[Request Info]\n ${JSON.stringify(requestInfo, null, 2)}\n`);
        channel.send(`[Response Info]\n ${JSON.stringify(responseInfo, null, 2)}`);
        channel.send(`[Response body]\n${prettyBody}`);
      }

      console.log(`[Response Info] ${req.method} - ${req.url} - ${JSON.stringify(responseInfo, null, 2)}`);
    });

    next();
  }
}

@Injectable()
export class FeedLoggerMiddleware implements NestMiddleware {
  constructor(private readonly discordBotService: DiscordBotService) { }

  use(req: Request, res: Response, next: NextFunction) {
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
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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
        prettyBody = `\`\`\`\n${body}\n\`\`\``; // Not JSON, keep original and format it
      }

      const responseInfo = {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        contentLength: res.get('Content-Length') || 'unknown',
        cookies: res.get('Set-Cookie') || 'none',
        responseTime: responseTime,
      };

      const channel = this.discordBotService.getClient().channels.cache.get('1237048051798118451');

      if (channel && channel instanceof TextChannel) {
        channel.send(`[Request Info]\n ${JSON.stringify(requestInfo, null, 2)}\n`);
        channel.send(`[Response Info]\n ${JSON.stringify(responseInfo, null, 2)}`);
        channel.send(`[Response body]\n${prettyBody}`);
      }

      console.log(`[Response Info] ${req.method} - ${req.url} - ${JSON.stringify(responseInfo, null, 2)}`);
    });

    next();
  }
}
