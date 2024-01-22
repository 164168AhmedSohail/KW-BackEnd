import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    exposedHeaders: 'x-auth',
  });

  const config = new DocumentBuilder()
    .setTitle('Booking App')
    .setDescription('Api routes for booking app')
    .setVersion('1.0')
    .addTag('booking-app')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(7000);
}
bootstrap();
