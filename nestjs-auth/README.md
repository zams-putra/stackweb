# Belajar nest js :

## Tech Stack :
- main framework: nestjs
- db: sqlite
- orm: prisma
- auth: jwt
- input validator: class-validator



## Step :
### - install nestjs 
```bash
npm i -g @nestjs/cli
npm ls
nest new belajar-auth-nest
cd belajar-auth-nest
```
### - setup controller, module, service
> controller
```ts
@Controller()
export class AppController {
}

@Controller('auth')
export class AuthController {
}
```
> module
```ts
@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
```
> service
```ts
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
}

```
### - setup prisma :
- install prisma :
```bash
npm install prisma --save-dev
npx prisma
npx prisma init
```
- setup schema.prisma
```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
}
```
- install sqlite3 prisma
```bash
npm i @prisma/adapter-better-sqlite3
```
- setup data model in schema.prisma
```prisma
model User {
  id Int @id @default(autoincrement())
  email String @unique
  password String
  createdAt DateTime @default(now())
}
```
- setup prisma.config.ts 
```ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});

```
- setup .env
```env
DATABASE_URL="file:./dev.db"
```
- migration data:
> dev.db dibuat
> tabel User dibuat 
> prisma client tergenerate
```bash
npx prisma generate
npx prisma migrate dev --name init
```

- cek db di vscode :
```bash
ctrl + shift + p
ketik dan cari: sqlite open database
```

### - use prisma :
- generate service prisma with nest 
```bash
nest g service prisma
```
- set service prisma
```ts
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
    super({ adapter });
  }
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

```
- daftarin ke app module.ts 
```ts
@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService, PrismaService],
})
```

### - setup DTO 
- fungsinya biar input user tervalidasi: email ya email, password minimal 8, gitu2 lah
```bash
npm i class-validator
```
- register dto di /dto/register.dto.ts 
```ts
export class RegisterDTO {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
```

### - setup register user function 
- install bcrypt buat hash pass :
```bash
npm i bcrypt
npm i --save-dev @types/bcrypt
```
- ubah auth service di /src/app.service.ts 
```ts 
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
}
```
- new method was here :
```ts 
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
```
- set di controller, /src/app.controller.ts, tambah di authController
```ts
  @Post('/register')
  async register(@Body() dto: RegisterDTO) {
    return {
      success: true,
      data: await this.authService.register(dto),
    };
  }
```
- tes register function with json data :
```http
http://127.0.0.1/api/auth/register - POST
```
> this data
```json
{
    "email": "sebussmith@gmail.com",
    "password": "smithman123"
}
```
- kalau ada error path2 db gitu giniin aja di /src/app.module.ts nya :
```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
```

## setup auth - JWT and passport
### passport
- auth middleware nestjs
- strategy auth, session, etc etc
```bash
npm install @nestjs/jwt @nestjs/passport passport-jwt @types/passport-jwt
```
### setup login
- bikin DTO login dulu di /dto/login.dto.ts
```ts
import { IsEmail, MinLength } from 'class-validator';
export class LoginDTO {
  @IsEmail()
  email: string;
  @MinLength(8)
  password: string;
}
```
- setup service login di /src/app.service.ts, di class AuthService tambahin method ini
```ts 
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
```
- set authController di /src/app.controller.ts
```ts
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
```
- config jwt di /src/app.module.ts 
```ts
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
```
- set di .env 
```env
JWT_SECRET='bebas-apa-aja'
```
- buat validasi token jwt di, buat di /auth/jwt.strategy.ts
```ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface typescriptRibetJwtAjaPakeDiTypeTypeJir {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'adalah-pokoknya',
    });
  }
  validate(payload: typescriptRibetJwtAjaPakeDiTypeTypeJir) {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
```
- register dulu JwtStrategy nya di /src/app.module.ts
```ts
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
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    PrismaService,
    JwtStrategy,
  ],
})
```
## set guard buat authorization
- biar user yg belum login gaboleh masuk profile gitu lah
- set ini di /guard/jwt.guard.ts
```ts 
import { AuthGuard } from '@nestjs/passport';
export class JwtAuthGuard extends AuthGuard('jwt') {}
```
- logicnya gausah di atur, soalnya udah di package passport
- test bikin endpoint profile buat authorization
- bikin service baru di /src/app.service.ts
```ts
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
```
- bikin controller baru di /src/app.controller.ts
```ts

interface JwtUser {
  userId: number;
  email: string;
}

interface JwtRequest extends Request {
  user: JwtUser;
}

@Controller('profile')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  getProfile(@Req() req: JwtRequest) {
    return this.userService.getProfile(req.user);
  }
}
```
- register in module baru di /src/app.module.ts 
```ts
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
    JwtStrategy,
    UserService,
  ],
})
```
- tes API login nya
```http
/api/auth/login POST
```
```json
{
    "email": "sebussmith@gmail.com",
    "password": "smithman123"
}
```
- tes api check profile nya
```http
/api/profile GET
```
```txt
- dengan header gini:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6.....
```
- tes tambahin route /dashboard dan ter authorize harus login dulu :
```ts
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
```