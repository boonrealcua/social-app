import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'JWT_SECRET_NO_EXPLOIT',
      signOptions: { expiresIn: '36000s' },
    }),
  ],
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
