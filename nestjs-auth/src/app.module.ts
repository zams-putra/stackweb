import { Module } from '@nestjs/common';
import {
  AppController,
  AuthController,
  UserController,
} from './app.controller';
import { AppService, AuthService, UserService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'adalah-pokoknya',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    PrismaService,
    UserService,
    JwtStrategy,
  ],
})
export class AppModule {}
