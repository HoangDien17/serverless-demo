import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import responseTime from 'response-time';
import { v4 as uuidV4 } from 'uuid';
import httpContext from 'express-http-context';
import { CORS_EXPOSED_HEADERS } from './shared/constants';
import { initializeSwagger } from './shared/swagger.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await initializeApp(app);
  await initializeSwagger(app);
  await app.listen(process.env.PORT);
}

async function initializeApp(app: INestApplication) {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(responseTime({ header: 'x-response-time' }));
  app.use((req: express.Request, res: express.Response, next: () => void) => {
    const correlationId = uuidV4();
    httpContext.set('timestamp', Date.now());
    httpContext.set('correlationId', correlationId);
    req['id'] = correlationId;
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(process.env.SERVICE_BASE_URL);
  app.enableCors({
    exposedHeaders: CORS_EXPOSED_HEADERS,
  });
}

bootstrap();
