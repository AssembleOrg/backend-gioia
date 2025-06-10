import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './errors/all-exceptions.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

// middlewares de seguridad
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as hpp from 'hpp';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // 1. Helmet: cabeceras HTTP seguras
  app.use(helmet());

  // 2. HPP: evita contaminación de parámetros
  app.use(hpp());

  // 4. Rate Limiter: máximo 100 requests por IP cada 15 minutos
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // límite de peticiones
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // // 6. CORS más seguro
  // app.enableCors({
  //   origin: process.env.FRONTEND_URL?.split(',') || [], // dominios confiables
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  // Pipes, filtros e interceptores globales (igual que antes)
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  // — Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Kansaco 2025 API')
    .setDescription('Endpoints to manage Productos, Pedidos, etc.')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);

  SwaggerModule.setup('docs', app as any, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(3001);
}
bootstrap();
