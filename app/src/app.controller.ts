import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("")
@Controller('')
export class AppController {

    @ApiOperation({ summary: '그룹 캘린더 생성' })
    @Get('health')
    checkHealth() {
        return { status: 'ok' };
    }
}