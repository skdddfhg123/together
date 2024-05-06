import { Body, Controller, Get, Param, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common'; import { AuthService } from './auth.service';
import { UserService } from 'src/db/user/user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/db/user/dtos/create-user.dto';
import { LoginDTO } from './dtos/login.dto';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { PayloadResponse } from './dtos/payload-response';
import { JwtAuthGuard } from './jwt.guard';
import { getPayload } from './getPayload.decorator';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private userCalendarService: UserCalendarService,
  ) { }

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
    @Body(ValidationPipe) loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    return this.authService.login(loginDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: '성공 시 해당 response 반환' })
  @Get('all')
  @UseGuards(JwtAuthGuard)
  GetAllByToken(
    @getPayload() payload: PayloadResponse
  ): Promise<any> {
    return this.authService.GetAllByToken(payload);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: '성공 시 해당 response 반환' })
  @Get('all/:userCalendarId')
  @UseGuards(JwtAuthGuard)
  GetAllByUCId(
    @Param('userCalendarId') userCalendarId: string
  ): Promise<any> {
    return this.authService.GetAllByUserCalendarId(userCalendarId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('token-test')
  @UseGuards(JwtAuthGuard)
  tokenTest(
    @getPayload() payload: PayloadResponse
  ): any {
    // console.log(payload);
    return payload;
  }
}
