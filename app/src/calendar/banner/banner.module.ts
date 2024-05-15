import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { JWTStrategy } from 'src/auth/strategy/jwt.strategy';
import { TokensModule } from 'src/db/tokens/tokens.module';
import { ImageModule } from 'src/image.upload/image.module';
import { Calendar } from '../entities/calendar.entity';
import { AwsModule } from 'src/image.upload/aws.s3/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner, Calendar]),
    TokensModule,
    ImageModule,
    AwsModule,
  ],
  controllers: [BannerController],
  providers: [
    BannerService,
    JWTStrategy,
  ],
  exports: [
    BannerService,
  ]
})
export class BannerModule {}
