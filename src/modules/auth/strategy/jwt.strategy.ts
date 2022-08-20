import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpirattion: false,
      secretOrKey: 'JWT_SECRET_NO_EXPLOIT',
    });
  }
  async validate(payload: any) {
    return {
      user: payload.user,
    };
  }
}
