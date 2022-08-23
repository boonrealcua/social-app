import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ConfigModule.forRoot();
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Doc Api')
    .setDescription('Api for Social App')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apidoc', app, document);
  await app.listen(process.env.APP_PORT, process.env.APP_HOST);
}
bootstrap();
