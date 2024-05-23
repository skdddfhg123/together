import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { Calendar } from '../entities/calendar.entity';
import { AwsService } from 'src/image.upload/aws.s3/aws.service';
import { ImageService } from 'src/image.upload/image.service';
import { UploadAppBannerDto, UploadWebBannerDto } from './dto/uploadBanner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
    private readonly awsService: AwsService,
    private readonly imageService: ImageService,
  ) {}

  // ============================================================================================
  // App Banner
  // ============================================================================================

  /** app에 저장된 이미지를 가져옵니다. 없으면 none이 반환됩니다. */
  async getAppBanner(calendarId: string): Promise<UploadAppBannerDto> {
    const banner = await this.bannerRepository.findOne({
      where: {
        calendar: {calendarId: calendarId}
      },
      relations: ['calendar']
    })

    if(!banner)
      throw new NotFoundException(`Not Found banner through this calendarId: ${calendarId}`);

    const getBanner = new UploadAppBannerDto();
    getBanner.alpha = banner.alpha;
    getBanner.appBannerUrl = banner.appBannerUrl;
    getBanner.textColor = banner.textColor;

    return getBanner;
  }

  /** app의 이미지 하나를 업로드합니다.이미지를 넣지 않고 투명도 및 텍스트 컬러를 넣으셔도 됩니다. */
  async uploadAppBanner(calendarId: string, uploadBannerDto: UploadAppBannerDto, imageFile: Express.Multer.File): Promise<UploadAppBannerDto> {
    let isEmpty = false;

    let banner = await this.bannerRepository.findOne({
      where: {
        calendar: {calendarId: calendarId}
      },
      relations: ['calendar']
    })

    if(!banner) {
      const calendarInfo = await this.calendarRepository.findOneBy({calendarId: calendarId});
      if(!calendarInfo)
        throw new NotFoundException(`Not found banner through this calendarId: ${calendarId}`);

      isEmpty = true;

      banner = new Banner();
      banner.calendar = calendarInfo;
    }

    if(imageFile !== undefined && banner.appBannerUrl !== 'none') {
      await this.awsService.imageDeleteInS3('banner', banner.appBannerUrl);
    }

    banner.alpha = uploadBannerDto.alpha == undefined ? '100' : uploadBannerDto.alpha;
    banner.textColor = uploadBannerDto.textColor == undefined ? '#000000' : uploadBannerDto.textColor;
    banner.appBannerUrl = imageFile !== undefined ? await this.imageService.bannerImageUpload(imageFile, calendarId + '_app')
                                               : banner.appBannerUrl === 'none' ? 'none' : banner.appBannerUrl;
    
    try {
      let savedBanner;

      if(isEmpty) {
        savedBanner = await this.bannerRepository.save(banner);
        return savedBanner;
      }
      else {
        await this.bannerRepository.update(banner.bannerId, banner);

        const updatedBanner = new UploadAppBannerDto();
        updatedBanner.alpha = banner.alpha;
        updatedBanner.appBannerUrl = banner.appBannerUrl;
        updatedBanner.textColor = banner.textColor;

        return updatedBanner;
      }
    }
    catch(err) {
      throw new InternalServerErrorException('save banner failed');
    }
  }

  /** app에 저장된 설정을 원복합니다. */
  async getBackAppBasic(calendarId: string): Promise<UploadAppBannerDto> {
    const banner = await this.bannerRepository.findOne({
      where: {
        calendar: {calendarId: calendarId}
      },
      relations: ['calendar']
    })

    if(!banner)
      throw new NotFoundException('There are no options to change');

    if(banner.appBannerUrl !== 'none')
      await this.awsService.imageDeleteInS3('banner', banner.appBannerUrl);

    const getBackBanner = new UploadAppBannerDto();
    getBackBanner.alpha = '100';
    getBackBanner.appBannerUrl = 'none';
    getBackBanner.textColor = '#000000';

    try {
      await this.bannerRepository.update(banner.bannerId, getBackBanner);
      return getBackBanner;
    }
    catch(err) {
      throw new InternalServerErrorException('back basic is failed');
    }
  }

  // ============================================================================================
  // Web Banner
  // ============================================================================================

  /** 웹에 저장된 이미지를 가져옵니다. 없으면 none이 반환됩니다. */
  async getWebBanner(calendarId: string): Promise<UploadWebBannerDto> {
    const banner = await this.bannerRepository.findOne({
      where: {
        calendar: {calendarId: calendarId}
      },
      relations: ['calendar']
    })

    if(!banner)
      throw new NotFoundException(`Not Found banner through this calendarId: ${calendarId}`);

    const getBanner = new UploadWebBannerDto();
    getBanner.webBannerUrl = banner.webBannerUrl;

    return getBanner;
  }

  /** 웹의 이미지를 업로드합니다. 넣지 않는다면 none이 반환됩니다.  */
  async uploadWebBanner(calendarId: string, imageFile: Express.Multer.File): Promise<UploadWebBannerDto> {
    let isEmpty = false;

    let banner = await this.bannerRepository.findOne({
      where: {
        calendar: {calendarId: calendarId}
      },
      relations: ['calendar']
    })

    if(!banner) {
      const calendarInfo = await this.calendarRepository.findOneBy({calendarId: calendarId});
      if(!calendarInfo)
        throw new NotFoundException(`Not found calendar this calendarId: ${calendarId}`);

      isEmpty = true;

      banner = new Banner();
      banner.webBannerUrl = 'none';
      banner.calendar = calendarInfo;
      calendarInfo.banner = banner;
    }

    if(imageFile !== undefined && banner.webBannerUrl !== 'none') {
      await this.awsService.imageDeleteInS3('banner', banner.webBannerUrl);
    }

    banner.webBannerUrl = imageFile !== undefined ? await this.imageService.bannerImageUpload(imageFile, calendarId + '_web')
                                               : banner.webBannerUrl === 'none' ? 'none' : banner.webBannerUrl;
    
    try {
      let savedBanner;

      if(isEmpty) {
        savedBanner = await this.bannerRepository.save(banner);
        return savedBanner;
      }
      else {
        await this.bannerRepository.update(banner.bannerId, banner);

        const updatedBanner = new UploadWebBannerDto();
        updatedBanner.webBannerUrl = banner.webBannerUrl;

        return updatedBanner;
      }
    }
    catch(err) {
      throw new InternalServerErrorException('save web banner failed');
    }
  }

  /** 웹에 저장된 설정을 원복합니다. */
  async getBackWebBasic(calendarId: string): Promise<UploadWebBannerDto> {
    const banner = await this.bannerRepository.findOne({
      where: {
        calendar: {calendarId: calendarId}
      },
      relations: ['calendar']
    })

    if(!banner)
      throw new NotFoundException('There are no options to change');

    if(banner.appBannerUrl !== 'none')
      await this.awsService.imageDeleteInS3('banner', banner.webBannerUrl);

    const getBackBanner = new UploadWebBannerDto();
    getBackBanner.webBannerUrl = 'none';

    try {
      await this.bannerRepository.update(banner.bannerId, getBackBanner);
      return getBackBanner;
    }
    catch(err) {
      throw new InternalServerErrorException('back web basic is failed');
    }
  }

}
