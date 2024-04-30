import { Body, Controller, Get, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { getPayload } from 'src/auth/getPayload.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Calendar } from './entities/calendar.entity';

@ApiTags("calendar")
@Controller('calendar')
export class CalendarController {
    constructor(
        private calendarService: CalendarService,
    ) {}

    @Post('/create_groupCalendar')
    @ApiOperation({ summary: 'Create a new group calendar' })
    @ApiResponse({ status: 201, description: 'Calendar created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CalendarCreateDto })
    @UseGuards(JwtAuthGuard)
    async createGroupCalendar(
      @Body() calendarCreateDto: CalendarCreateDto,
      @getPayload() payload: PayloadResponse  // 설명 추가 필요
    ): Promise<Calendar> {
      console.log(calendarCreateDto);
      console.log(payload);
      return await this.calendarService.createGroupCalendar(calendarCreateDto, payload);
    }

    

    // @Get()
    // async getUsers() {
    //     return 'Get Users';
    // }

    // @Post()
    // async createSchedule() {
    //     return 'Create Schedule';
    // }

    // @Post('/:id')
    // @UseInterceptors(FileFieldsInterceptor([
    //     {name: 'cover_image', maxCount: 1},
    //     {name: 'banner_image', maxCount: 1}
    // ]))
    // async createCalendar(
    //     @Body() body: CalendarCreateDto, 
    //     @UploadedFile() cover_image?: Express.Multer.File,
    //     @UploadedFile() banner_image?: Express.Multer.File
    // ) {

    //     return this.calendarService.createCalendar(body, cover_image, banner_image);
    // }
}
