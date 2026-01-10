import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RegisterDTO } from 'dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'dto/login.dto';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      status: 'ok',
      message: 'Welcome home',
    };
  }
  getPets(): object {
    return {
      status: 'ok',
      message: 'My pets are cats',
    };
  }
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  getRegister(): object {
    return {
      status: 'ok',
      message: 'Here is your register page',
    };
  }
  getLogin(): object {
    return {
      status: 'ok',
      message: 'Here is your login page',
    };
  }
  async register(dto: RegisterDTO) {
    const ada = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (ada) {
      throw new ConflictException('email udah ada yg pake');
    }
    const hashedPass = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPass,
      },
    });
    return {
      id: user.id,
      email: user.email,
    };
  }
  async login(dto: LoginDTO) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException(
        'invalid creds, salah pass atau email lah pokoknya',
      );
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException(
        'invalid creds, salah pass atau email lah pokoknya',
      );
    }
    const payloadJwt = {
      sub: user.id,
      email: user.email,
    };
    return {
      access_token: await this.jwt.signAsync(payloadJwt),
    };
  }
}

@Injectable()
export class UserService {
  constructor() {}

  getProfile(user: { userId: number; email: string }) {
    return {
      id: user.userId,
      email: user.email,
      message: `hello ${user.email}`,
      status: 'ok',
    };
  }
}
