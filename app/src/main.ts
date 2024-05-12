import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import * as compression from 'compression';
import { ChatModule } from './chat/chat.module';
import { SwaggerDocument } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3005', // Allow only your React app to make requests
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH', // Optionally specify which methods are allowed
    allowedHeaders: 'Content-Type,Authorization', // Optionally specify allowed headers
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 자동 DTO 검증
    transform: true  // 입력 타입 자동 변환
  }));

  // app.use(compression()); // HTTP 응답 압축으로 네트워크 대역폭 절약

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

  const swaggerDocument = SwaggerDocument(app, [ChatModule]);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(3000);
}
bootstrap();
