import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TokensModule } from '../tokens/tokens.module';
import { ImageModule } from 'src/image.upload/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TokensModule,
    ImageModule,
  ],
  providers: [UserService],
  exports: [UserService]

})
export class UserModule { }
