import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getConfig } from 'src/config';

@Module({
  imports: [
    // AuthService
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: getConfig().authService.urls,
          queue: getConfig().authService.queue,
          queueOptions: {
            durable: getConfig().authService.durable,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroserviceClientsModule {}
