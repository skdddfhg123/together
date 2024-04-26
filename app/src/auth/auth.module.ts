import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { GoogleStrategy } from './utils/google.strategy';
import { JwtStrategy } from './utils/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.register({
      secret: 'test',
      // signOptions: {expiresIn: '360s'}
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService]
})
export class AuthModule {}
