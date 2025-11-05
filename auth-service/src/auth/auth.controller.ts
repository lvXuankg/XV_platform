import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { errorHandling } from 'src/common/constants/error-handling';
import { LoggerService } from 'src/common/logger/logger.service';

@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern('auth.register')
  async register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern('auth.login')
  async login(loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException(errorHandling.invalidCredential.message);
    }
    return this.authService.login(user);
  }

  @MessagePattern('auth.refreshToken')
  async refreshToken({ refreshToken, userId }: { refreshToken: string; userId: string }) {
    return this.authService.refreshToken(refreshToken, BigInt(userId));
  }

  @MessagePattern('auth.validate')
  async validateToken({ token }: { token: string }) {
    try {
      // Verify và decode JWT
      const payload = await this.authService.verifyToken(token);
      return {
        valid: true,
        payload,
        user: {
          id: payload.sub,
          email: payload.email,
        },
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  @MessagePattern('auth.logout')
  async logout({ refreshToken, userId }: { refreshToken: string; userId: string }) {
    return this.authService.logout(refreshToken, BigInt(userId));
  }

  @MessagePattern('auth.logoutAllDevices')
  async logoutAllDevices({ userId }: { userId: string }) {
    return this.authService.logoutAllDevices(BigInt(userId));
  }

  @MessagePattern('health.ping')
  async healthPing() {
    return {
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    };
  }
}
