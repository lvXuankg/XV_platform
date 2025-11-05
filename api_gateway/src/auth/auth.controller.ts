import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { swaggerResponses } from '../common/constants/swagger-response';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Đăng ký tài khoản người dùng',
    description: 'Đăng ký với email + mật khẩu',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Dữ liệu đăng ký',
    examples: {
      example1: {
        summary: 'Valid registration',
        value: {
          email: 'user@example.com',
          password: 'SecurePass123!@',
        },
      },
    },
  })
  @ApiResponse(swaggerResponses.register.success)
  @ApiResponse(swaggerResponses.register.badRequest)
  @ApiResponse(swaggerResponses.register.conflict)
  @ApiResponse(swaggerResponses.register.busy)
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập tài khoản',
    description: 'Đăng nhập với email + mật khẩu',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Dữ liệu đăng nhập',
    examples: {
      example1: {
        summary: 'Valid login',
        value: {
          email: 'user@example.com',
          password: 'SecurePass123!@',
        },
      },
    },
  })
  @ApiResponse(swaggerResponses.login.success)
  @ApiResponse(swaggerResponses.login.badRequest)
  @ApiResponse(swaggerResponses.login.unauthorized)
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  //   @Post('logout')
}
