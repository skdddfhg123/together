process.env.TZ = 'UTC';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { ChatModule } from './chat/chat.module';
import { SwaggerDocument } from './swagger';

// function excludeModulesFromSwaggerDocument(app: INestApplication, modulesToExclude: any[]) {
//   const swaggerOptions = new DocumentBuilder()
//     .setTitle('Example API')
//     .setDescription('The API description')
//     .setVersion('1.0')
//     .addTag('test')
//     .addBearerAuth(
//       {
//         type: "http",
//         scheme: "bearer",
//         bearerFormat: "JWT",
//         name: "JWT",
//         description: "Enter JWT token",
//         in: "header",
//       },
//       "JWT-auth"
//     )
//     .build();

//   const document = SwaggerModule.createDocument(app, swaggerOptions);
//   document.paths = Object.fromEntries(
//     Object.entries(document.paths).filter(([path, pathObject]) => {
//       const isExcluded = modulesToExclude.some(module =>
//         Object.values(module).some((controller: string) => pathObject[controller])
//       );
//       return !isExcluded;
//     }),
//   );

//   return document;
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(compression()); // HTTP 응답 압축으로 네트워크 대역폭 절약

  const swaggerDocument = SwaggerDocument(app, [ChatModule]);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(3000);
}
bootstrap();