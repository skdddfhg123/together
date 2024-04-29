import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { LoginDTO } from './dto/login.dto';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @ApiResponse({
    status: 201,
    description: '성공 시 해당 response 반환',
    type: CreateUserDTO
  })
  @Post('signup')
  signUp(@Body(ValidationPipe) userDTO: CreateUserDTO): Promise<User> {
      try {
          return this.userService.signUp(userDTO);
      } catch (e) {
          throw e;
      }
  }

  @ApiResponse({
      status: 201,
      description: '성공 시 해당 response 반환',
      type: LoginDTO
  })
  @Post('login')
  login(
      @Body(ValidationPipe) loginDTO: LoginDTO): Promise<{ accessToken: string }> {
      return this.authService.login(loginDTO);
  }


}
