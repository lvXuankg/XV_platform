import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { getConfig } from './config';
import { setupSwagger } from './config/swagger.config';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const config = getConfig();

  const app = await NestFactory.create(AppModule);

  if (config.http.nodeEnv !== 'production') {
    setupSwagger(app);
  }

  app.setGlobalPrefix('api', {
    exclude: ['/docs'],
  });

  await app.listen(config.http.port);
  logger.log(
    `Api Gateway is running in : ${config.http.baseUrl}:${config.http.port}/${config.http.prefix}`,
  );
  if (config.http.nodeEnv !== 'production') {
    logger.log(
      `📘 Swagger Docs: ${config.http.baseUrl}:${config.http.port}/docs`,
    );
  }
}
bootstrap().catch((error) => {
  logger.error('Failed to start Api Gateway!');
  process.exit(1);
});
