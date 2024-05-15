import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { SwaggerDocument } from './swagger';
import { SocketIoAdapter } from './webSocket/adapter/socketIoAdapter';
import { EventModule } from './webSocket/event.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3005', 'http://15.164.174.224:3005', 'http://localhost:3000', 'http://localhost:5005', 'http://localhost:5000', 'http://172.20.176.1:3000', "http://192.168.1.98:3000"],
      credentials: true,
    }
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 자동 DTO 검증
    transform: true  // 입력 타입 자동 변환
  }));

  app.use(compression()); // HTTP 응답 압축으로 네트워크 대역폭 절약

  const Sentry = require('@sentry/node');
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  const swaggerDocument = SwaggerDocument(app, [EventModule]);
  SwaggerModule.setup('api', app, swaggerDocument);

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(3000);
}
bootstrap();
