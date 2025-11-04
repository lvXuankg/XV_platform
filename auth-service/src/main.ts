import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getConfig } from './config';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint.serializer.interceptor';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const config = getConfig();

  // Create RabbitMQ Microservice
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: config.rabbitmq.urls,
      queue: config.rabbitmq.queue,
      queueOptions: {
        durable: config.rabbitmq.durable,
      },
    },
  });

  // Create HTTP Server for Health Check & REST API
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.http.prefix);

  // Add BigInt Serializer Interceptor
  app.useGlobalInterceptors(new BigIntSerializerInterceptor());

  // Start both microservice and HTTP server
  await microservice.listen();
  logger.log(`🚀 RabbitMQ Microservice connected to queue: ${config.rabbitmq.queue}`);

  await app.listen(config.http.port);
  logger.log(
    `✅ Auth Service running at ${config.http.baseUrl}:${config.http.port}/${config.http.prefix}`,
  );
  logger.log(
    `📊 Health Check: ${config.http.baseUrl}:${config.http.port}/${config.http.prefix}/health`,
  );
}

bootstrap().catch((error) => {
  logger.error('❌ Failed to start Auth Service:', error);
  process.exit(1);
});
