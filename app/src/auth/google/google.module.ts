import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './utils/strategy/google.strategy';
import { GoogleController } from './google.controller';
import { SocialEventModule } from 'src/db/event/socialEvent/socialEvent.module';
import { TokensModule } from 'src/db/tokens/tokens.module';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    SocialEventModule,
    TokensModule,
  ],
  controllers: [GoogleController],
  providers: [
    GoogleService,
    GoogleStrategy,
  ],
  exports: [GoogleService],
})
export class GoogleModule{}