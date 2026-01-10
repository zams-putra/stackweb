import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService, AuthService, UserService } from './app.service';
import { RegisterDTO } from 'dto/register.dto';
import { JwtAuthGuard } from 'guard/jwt.guard';
import { LoginDTO } from 'dto/login.dto';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  getHello(): object {
    return this.appService.getHello();
  }

  @Get('/pets')
  @HttpCode(200)
  getPets(): object {
    return this.appService.getPets();
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/register')
  getRegister(): object {
    return this.authService.getRegister();
  }
  @Get('/login')
  getLogin(): object {
    return this.authService.getLogin();
  }

  @Post('/register')
  async register(@Body() dto: RegisterDTO) {
    return {
      success: true,
      data: await this.authService.register(dto),
    };
  }
  @Post('/login')
  async login(@Body() dto: LoginDTO) {
    return {
      success: true,
      data: await this.authService.login(dto),
    };
  }
}

interface JwtUser {
  userId: number;
  email: string;
}

interface JwtRequest extends Request {
  user: JwtUser;
}

@Controller('')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @HttpCode(200)
  getProfile(@Req() req: JwtRequest) {
    return this.userService.getProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/dashboard')
  @HttpCode(200)
  getDashboard() {
    return {
      status: 'ok',
      messages: 'boleh',
    };
  }
}
