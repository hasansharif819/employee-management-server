/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ====== Initialize NestJS application with necessary configurations ======
  const config = new DocumentBuilder()
    .setTitle('Organogram API')
    .setDescription('This is the API for the organogram')
    .setVersion('1.0')
    .addTag('Organogram')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter your JWT token',
      in: 'header',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  // ====== Enable CORS, set global prefix, and add validation pipe for request data ======
  app.enableCors({
    origin: [
      'http://localhost:5173',
      // process.env.FRONTEND_URL,
      // 'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      // forbidNonWhitelisted: true,
      // transform: true,
      // whitelist: true,
    }),
  );

    // Use Winston logger for NestJS internal logs
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));


  await app.listen(process.env.PORT || 5000);
  console.log(
    `✅Server is running on port http://localhost:${process.env.PORT || 5000}`,
  );
}

bootstrap();
