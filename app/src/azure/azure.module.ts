import { Module } from '@nestjs/common';
import { AzureController } from './azure.controller';
import { AzureService } from './azure.service';
import { PassportModule } from '@nestjs/passport';
import { AzureAdStrategy } from './utils/azuread.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'AzureAD',
    }),
  ],
  controllers: [AzureController],
  providers: [
    AzureService,
    AzureAdStrategy,
  ],
})
export class AzureModule {}
