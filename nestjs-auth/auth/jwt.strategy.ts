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
