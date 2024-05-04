import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessToken } from './entities/userAccessToken.entity';
import { UserRefreshToken } from './entities/userRefreshToken.entity';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserAccessToken, UserRefreshToken]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
          }),
      ],
      providers: [TokensService],
      exports: [TokensService]
  
  })
  export class TokensModule {}