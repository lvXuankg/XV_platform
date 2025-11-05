import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from 'src/common/logger/logger.service';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private client: ClientProxy,
    private readonly logger: LoggerService,
  ) {}

  async register(data: RegisterDto) {
    return sendMicroserviceRequest(this.client, 'auth.register', data);
  }

  async login(data: LoginDto) {
    return sendMicroserviceRequest(this.client, 'auth.login', data);
  }

  async refreshToken(refreshToken: string, userId: string) {
    return sendMicroserviceRequest(this.client, 'auth.refreshToken', {
      refreshToken,
      userId,
    });
  }

  async logout(refreshToken: string, userId: string) {
    return sendMicroserviceRequest(this.client, 'auth.logout', {
      refreshToken,
      userId,
    });
  }

  async logoutAllDevices(userId: string) {
    return sendMicroserviceRequest(this.client, 'auth.logoutAllDevices', {
      userId,
    });
  }
}
