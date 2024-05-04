import { Body, Controller, Get, Post, Req, Request, UseGuards, ValidationPipe } from '@nestjs/common';import { AuthService } from './auth.service';
import { UserService } from 'src/db/user/user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/db/user/dtos/create-user.dto';
import { User } from 'src/db/user/entities/user.entity';
import { LoginDTO } from './dtos/login.dto';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { PayloadResponse } from './dtos/payload-response';
import { JwtAuthGuard } from './strategy/jwt.guard';
import { getPayload } from './getPayload.decorator';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { RefreshAuthGuard } from './strategy/refresh.guard';

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
  async signUp(@Body(ValidationPipe) userDTO: CreateUserDTO): Promise<PayloadResponse> {
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
      @Body(ValidationPipe) loginDTO: LoginDTO): Promise<{ accessToken: string, refreshToken: string }> {
      return this.authService.login(loginDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('token-test')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(RefreshAuthGuard)
  tokenTest (
    @getPayload() payload: PayloadResponse,
  ): any {
    console.log("1111111")
    // console.log(payload);
    // console.log(req.cookie)
    return payload;
  }
}
