import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET',
    allowedHeaders: 'Content-Type, Accept', 
  });

  const configService = app.get(ConfigService);

  await app.listen(configService.get<string>('PORT') || 3000);
  console.log(`Application in PORT: ${configService.get<string>('PORT')}`);
}
bootstrap();
