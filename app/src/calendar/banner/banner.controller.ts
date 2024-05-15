import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { BannerService } from './banner.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAppBannerDto, GetWebBannerDto } from './dto/getBanner.dto';
import { UploadAppBannerDto, UploadWebBannerDto } from './dto/uploadBanner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

@ApiTags('banner')
@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
  ) {}

  // ============================================================================================
  // App Banner
  // ============================================================================================

  /** app에 저장된 이미지를 가져옵니다. 없으면 none이 반환됩니다. */
  @ApiOperation({ summary: '그룹캘린더 app 배너 가져오기' })
  @ApiResponse({ status: 201, description: 'Banner get url successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('get/app/:calendarId')
  async getAppBanner(
    @Param('calendarId') calendarId: string,
  ): Promise<GetAppBannerDto> {
    return await this.bannerService.getAppBanner(calendarId);
  }

  /** app에 이미지 하나를 업로드합니다.이미지를 넣지 않고 투명도 및 텍스트 컬러를 넣으셔도 됩니다. */
  @ApiOperation({ summary: '그룹캘린더 app 배너 업로드' })
  @ApiResponse({ status: 201, description: 'Banner upload successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseInterceptors(FileInterceptor('bannerFile'))
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
        type: 'object',
        properties: {
            bannerFile: {
                type: 'string',
                format: 'binary',
                description: 'banner image file'
            },
            alpha: {
              type: 'number',
              description: 'Banner Alpha'
            },
            textColor: {
              type: 'string',
              description: 'Banner Text Color'
            }
        }
    }
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('upload/app/:calendarId')
  async uploadAppBanner(
    @Param('calendarId') calendarId: string,
    @Body() uploadAppBannerDto: UploadAppBannerDto,
    @UploadedFile() bannerFile: Express.Multer.File
  ): Promise<UploadAppBannerDto> {
    return await this.bannerService.uploadAppBanner(calendarId, uploadAppBannerDto, bannerFile);
  }

  /** app에 저장된 설정을 원복합니다. */
  @ApiOperation({ summary: '그룹캘린더 app 배너 설정 Default로 원복' })
  @ApiResponse({ status: 201, description: 'banner get original successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('getback/app/:calendarId')
  async getbackAppBanner(
    @Param('calendarId') calendarId: string,
  ) {
    return this.bannerService.getBackAppBasic(calendarId);
  }

  
  // ============================================================================================
  // Web Banner
  // ============================================================================================

  /** web에 저장된 이미지를 가져옵니다. 없으면 none이 반환됩니다. */
  @ApiOperation({ summary: '그룹캘린더 web 배너 가져오기' })
  @ApiResponse({ status: 201, description: 'Banner get url successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('get/web/:calendarId')
  async getWebBanner(
    @Param('calendarId') calendarId: string,
  ): Promise<GetWebBannerDto> {
    return await this.bannerService.getWebBanner(calendarId);
  }

  /** web의 이미지를 업로드합니다. 넣지 않는다면 none이 반환됩니다.  */
  @ApiOperation({ summary: '그룹캘린더 web 배너 업로드' })
  @ApiResponse({ status: 201, description: 'Banner upload successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseInterceptors(FileInterceptor('bannerFile'))
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
        type: 'object',
        properties: {
          bannerFile: {
                type: 'string',
                format: 'binary',
                description: 'banner image file'
            },
        }
    }
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('upload/web/:calendarId')
  async uploadWebBanner(
    @Param('calendarId') calendarId: string,
    @UploadedFile() bannerFile: Express.Multer.File
  ): Promise<UploadWebBannerDto> {
    return await this.bannerService.uploadWebBanner(calendarId, bannerFile);
  }

  /** web에 저장된 설정을 원복합니다. */
  @ApiOperation({ summary: '그룹캘린더 web 배너 설정 Default로 원복' })
  @ApiResponse({ status: 201, description: 'banner get original successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('getback/web/:calendarId')
  async getbackWebBanner(
    @Param('calendarId') calendarId: string,
  ) {
    return this.bannerService.getBackWebBasic(calendarId);
  }
}
