import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { SocialEventModule } from 'src/db/event/socialEvent/socialEvent.module';
import { TokensModule } from 'src/db/tokens/tokens.module';
import { JWTStrategy } from '../strategy/jwt.strategy';
import { RefreshStrategy } from '../strategy/refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AzureService } from './azure.service';
import { AzureController } from './azure.controller';
import { MicrosoftStrategy } from './utils/strategy/microsoftStrategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'azure' }),
    // PassportModule,
    HttpModule,
    SocialEventModule,
    TokensModule,
  ],
  controllers: [AzureController],
  providers: [
    AzureService,
    JWTStrategy,
    RefreshStrategy,
    MicrosoftStrategy,
  ],
  exports: [AzureService],
})
export class AzureModule{}