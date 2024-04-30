import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';import { AuthService } from './auth.service';
import { UserService } from 'src/db/user/user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/db/user/dtos/create-user.dto';
import { User } from 'src/db/user/entities/user.entity';
import { LoginDTO } from './dtos/login.dto';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { SignUpResponse } from './dtos/signup-response';
import { JwtAuthGuard } from './jwt.guard';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private userCalendarService: UserCalendarService,
  ) {}

  @ApiResponse({
    status: 201,
    description: '성공 시 해당 response 반환',
    type: CreateUserDTO
  })
  @Post('signup')
  async signUp(@Body(ValidationPipe) userDTO: CreateUserDTO): Promise<SignUpResponse> {
      try {
          const user = await this.userService.signUp(userDTO);
          const userCalendar = await this.userCalendarService.userCalendarCreate(user);
          return {
            useremail: user.useremail,
            nickname: user.nickname,
            userCalendarId: userCalendar.userCalendarId
          };
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

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: any): any {
    // 사용자 정보나 필요한 데이터만 추출

    console.log(req.user)
    console.log(req.userCalendar)

    return {
        nickname: req.user?.nickname,
        useremail: req.user?.useremail,
        userCalendarId: req.user?.userCalendarId
    };
  }
}
