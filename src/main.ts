import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigins = (configService.get<string>('corsOrigins') || '')
    .split(',')
    .map(origin => origin.trim());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new CustomValidationPipe());

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'login-token'],
  });

  const port = configService.get<number>('port');
  await app.listen(port);
  console.log(`App running on port ${port}`);
}
bootstrap();
