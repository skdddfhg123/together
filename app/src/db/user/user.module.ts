import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

const jwtConfig = 'together';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  // controllers: [UserController],
  providers: [UserService],
  exports: [UserService]

})
export class UserModule {}
