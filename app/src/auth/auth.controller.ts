import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common'; import { AuthService } from './auth.service';
import { UserService } from 'src/db/user/user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/db/user/dtos/create-user.dto';
import { LoginDTO } from './dtos/login.dto';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { PayloadResponse } from './dtos/payload-response';
import { JwtAuthGuard } from './strategy/jwt.guard';
import { getPayload } from './getPayload.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/feed/dtos/file.upload.dto';
import { UserUpdateDto } from 'src/db/user/dtos/user.update.dto';

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
        userCalendarId: userCalendar.userCalendarId,
        isFirst: user.isFirst,
      };
    } catch (e) {
      throw e;
    }
  }

  @ApiResponse({ status: 201, description: 'Successfully logged in', type: LoginDTO })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('login')
  async login(
    @Body(ValidationPipe) loginDTO: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(loginDTO);
  }

  @ApiResponse({ status: 201, description: 'Successfully logged in', type: LoginDTO })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('login/v2')
  async login2(
    @Body(ValidationPipe) loginDTO: LoginDTO,
  ): Promise<any> {
    return this.authService.login2(loginDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Successfully retrieved user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('all')
  @UseGuards(JwtAuthGuard)
  GetAllByToken(
    @getPayload() payload: PayloadResponse
  ): Promise<any> {
    return this.authService.GetAllByToken(payload);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '로그인/리다이렉트 시 실행 (필터:앞뒤2달/멤버가 포함된 일정' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('all/v2')
  @UseGuards(JwtAuthGuard)
  GetAllByToken2(
    @getPayload() payload: PayloadResponse
  ): Promise<any> {
    return this.authService.GetAllByTokenV2(payload);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Successfully retrieved user calendar data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('all/:userCalendarId')
  @UseGuards(JwtAuthGuard)
  GetAllByUCId(
    @Param('userCalendarId') userCalendarId: string
  ): Promise<any> {
    return this.authService.GetAllByUserCalendarId(userCalendarId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '캘린더 멤버 일정 불러오기 (필터:앞뒤2달/멤버가 포함된 일정' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user calendar data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Calendar not found or no attendees' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('all/getcalendar/:calendarId')
  async GetAllEvenByCalendarId(
    @Param('calendarId', ParseUUIDPipe) calendarId: string
  ): Promise<any> {
    try {
      return await this.authService.GetAllEventByCalendarId(calendarId, new Date());
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('An unexpected error occurred while fetching the calendar data');
      }
    }
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '캘린더 멤버 일정 불러오기 (필터:앞뒤2달/멤버가 포함된 일정)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user calendar data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Calendar not found or no attendees' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('all/getcalendar/V2/:calendarId')
  async GetAllEvenByCalendarIdV2(
    @Param('calendarId', ParseUUIDPipe) calendarId: string
  ): Promise<any> {
    try {
      return await this.authService.GetAllEventByCalendarIdV2(calendarId, new Date());
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('An unexpected error occurred while fetching the calendar data');
      }
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get('token-test')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(RefreshAuthGuard)
  tokenTest(
    @getPayload() payload: PayloadResponse,
  ): any {
    return payload;
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Update profile thumbnail',
    type: FileUploadDto,
  })
  @Post('update/thumbnail')
  async updateProfile(
    @getPayload() payload: PayloadResponse,
    @UploadedFile() file: Express.Multer.File
  ): Promise<UserUpdateDto> {
    return await this.userService.updateThumbnail(payload, file);
  }

  @ApiBody({
    description: 'Check User is First',
  })
  @ApiResponse({ status: 200, description: 'true or false' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('tutorial')
  async checkProceedTutorial(@getPayload() payload: PayloadResponse): Promise<string> {
    return await this.userService.tutorialComplete(payload.useremail);
  }
}
