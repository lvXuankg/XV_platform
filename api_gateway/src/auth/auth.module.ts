import { Module } from '@nestjs/common';
import { MicroserviceClientsModule } from '../microservice-clients/microservice-clients.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MicroserviceClientsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
