import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './utils/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

const jwtConfig = 'together';

@Module({
  imports: [
    // PassportModule.register({defaultStrategy: 'jwt'}),
    // JwtModule.register({
    //   secret : process.env.JWT_SECRET || jwtConfig,
    //   signOptions:{
    //     expiresIn: 3600,
    //   }
    // }),
    //TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([User])
  ],
  // controllers: [UserController],
  providers: [UserService],
  exports: [UserService]

})
export class UserModule {}
