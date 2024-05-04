import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TokensModule,
  ],
  providers: [UserService],
  exports: [UserService]

})
export class UserModule {}
